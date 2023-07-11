import React, { useEffect, useState } from 'react'
import { calculateRelations, getGenericMatchup } from '../../utils/types'
import { useQueries } from '@tanstack/react-query'
import axios from 'axios'
import IndividualType from './IndividualType'
import styles from './TypeMatchups.module.scss'

// groups each pokemon types into pairs (an array). single type pokemon have "null as their secondary type".
const getTypes = (data) => {
    if (data.types.length === 1) {
        const types = [data.types[0].type.name, "null"]
        return {types: types}
    } else {
        const types = data.types.map(type => type.type.name);
        return {types: types}
    }
}

export default function TypeMatchups({ team, generation }) {

    const [allTypes, setAllTypes] = useState([]);

    const typesInTeamQueries = team.map(member => {
        return {
            queryKey: ['PokemonVarietyInfo', member.id],
            queryFn: () =>
                axios
                    .get(`https://pokeapi.co/api/v2/pokemon/${member.id}`)
                    .then((res) => res.data),
            select: getTypes
        }
    })

    // nested array of types.
    const typesInTeamResults = useQueries({ queries: typesInTeamQueries})

    const isLoadingTeam = typesInTeamResults.some(r => r.isLoading);

    // check if all data is loaded.
    const isEnabled = typesInTeamResults.every(r => r.data);

    // flattens the pairs of types into an array for parallel querying.
    const flatTypeArray = typesInTeamResults.flatMap(r => r.data?.types)

    const allTypeQueries = flatTypeArray.map(type => {
        if (!type || type === "null") {
            return {
                queryKey: ["type", "null"],
                queryFn: () => "",
                enabled: isEnabled,
            }
        } else {
            return {
                queryKey: ["type", type],
                queryFn: () => 
                    axios
                        .get(`https://pokeapi.co/api/v2/type/${type}`)
                        .then(res => res.data),
                enabled: isEnabled,
            }
        }
    })
    
    // if typeArray data is still loading, typeQueries will be empty array, no querying will take place.
    const allTypesResults = useQueries({ queries: allTypeQueries})
    const isLoadingTypes = allTypesResults.some(r => r.isLoading);

    useEffect(() => {
        setAllTypes(Object.keys(getGenericMatchup(generation)));
    }, [generation])


    if (isLoadingTeam) {
        return "Loading Team Types";
    }

    if (isLoadingTypes) {
        return 'Loading Matchups';
    }

    // group types back into pairs (each pair representing a pokemon)
    const groupedTypes = [];
    while(allTypesResults.length) groupedTypes.push(allTypesResults.splice(0,2));
    // for Each typepair, get the matchups against all types e.g. {fire: 0.5, water: 2...}
    const allMatchups = (groupedTypes.map(typeGroup => calculateRelations(generation, typeGroup[0].data, typeGroup[1].data)));

    return (
        <div>
            <div className={styles.typeContainer}>
                {allTypes.map(type => {
                    // For each type, get each member's matchup against it as and object array [{id, value}], to be passed to component
                    const eachMemberThisTypeMatchup = allMatchups.map((matchup, index) => {
                        return {
                            id: team[index].id,
                            value: matchup[type],
                        }
                    })

                    return (
                        <IndividualType key={type} type={type} pokemonMatchups={eachMemberThisTypeMatchup} />
                    )
                })}
            </div>
        </div>
    )
}
