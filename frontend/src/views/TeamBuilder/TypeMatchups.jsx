import { useEffect, useState } from 'react'
import { calculateDefensiveRelations, calculateOffensiveRelations, getGenericMatchup } from '../../utils/types'
import { useQueries } from '@tanstack/react-query'
import axios from 'axios'
import IndividualType from './IndividualType'
import styles from './TypeMatchups.module.scss'
import OffensivePokemonMatchup from './OffensivePokemonMatchup'
import classNames from 'classnames'
import ThemedBox from '../components/ThemedBox'
import DefensivePokemonMatchup from './DefensivePokemonMatchup'
import { useParams } from 'react-router-dom'

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

const Views = {
    DEFENSIVE_TYPE: "defensive-type",
    DEFENSIVE_POKEMON: "defensive-pokemon",
    OFFENSIVE_TYPE: "offensive-type",
    OFFENSIVE_POKEMON: "offensive-pokemon",
}

export default function TypeMatchups({ team }) {

    const [allTypes, setAllTypes] = useState([]);
    const [selectedView, setSelectedView] = useState(Views.DEFENSIVE_POKEMON);
    const { gen: generation } = useParams();

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

    // data: nested array of types.
    const typesInTeamResults = useQueries({ queries: typesInTeamQueries})

    const isLoadingTeam = typesInTeamResults.some(r => r.isLoading);

    // error fetching team?
    const isErrorTeam = typesInTeamResults.some(r => r.isError);
    const allErrorsTeam = typesInTeamResults.filter(r => r.isError).map(r => r.error.message);

    // check if all data is loaded to run dependent query
    const isEnabled = typesInTeamResults.every(r => r.data);

    // flattens the pairs of types into an array for dependent querying.
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

    if (isErrorTeam) {
        return (
            <div>
                {allErrorsTeam.map(error => (
                    <h2>{error}</h2>
                ))}
            </div>
        )
    } 

    // group types back into pairs (each pair representing a pokemon)
    const groupedTypes = [];
    while(allTypesResults.length) groupedTypes.push(allTypesResults.splice(0,2));
    // for Each typepair, get the matchups against all types e.g. {fire: 0.5, water: 2...}
    const allDefensiveMatchups = (groupedTypes.map(typeGroup => calculateDefensiveRelations(generation, typeGroup[0].data, typeGroup[1].data)));
    const allOffensiveMatchups = (groupedTypes.map(typeGroup => calculateOffensiveRelations(generation, typeGroup[0].data, typeGroup[1].data)));

    return (
        <div className={styles.container}>
            <div className={styles.selectorContainer}>
                <label className={classNames(styles.selector, selectedView === Views.DEFENSIVE_POKEMON ? styles.active : "")} 
                    onClick={() => setSelectedView(Views.DEFENSIVE_POKEMON)}>Pokemon: Defence
                </label>
                <label className={classNames(styles.selector, selectedView === Views.OFFENSIVE_POKEMON ? styles.active : "")} 
                    onClick={() => setSelectedView(Views.OFFENSIVE_POKEMON)}>Pokemon: Offence
                </label>
                <label className={classNames(styles.selector, selectedView === Views.DEFENSIVE_TYPE ? styles.active : "")} 
                    onClick={() => setSelectedView(Views.DEFENSIVE_TYPE)}>Types: Defence
                </label>

                <label className={classNames(styles.selector, selectedView === Views.OFFENSIVE_TYPE ? styles.active : "")} 
                    onClick={() => setSelectedView(Views.OFFENSIVE_TYPE)}>Types: Offence
                </label>
            </div>
            { selectedView === Views.DEFENSIVE_TYPE && <div className={styles.typeContainer}>
                {allTypes.map(type => {
                    // For each type, get each member's matchup against it as and object array [{id, value}], to be passed to component
                    const eachMemberThisTypeMatchup = allDefensiveMatchups.map((matchup, index) => {
                        return {
                            id: team[index].id,
                            value: matchup[type],
                        }
                    })

                    return (
                        <IndividualType key={type} type={type} pokemonMatchups={eachMemberThisTypeMatchup} />
                    )
                })}
            </div> }

            { selectedView === Views.DEFENSIVE_POKEMON && <div className={styles.typeContainer}>
                {allDefensiveMatchups.map((matchup, index) => (
                    <ThemedBox key={index} type1={typesInTeamResults[index].data.types[0]} type2={typesInTeamResults[index].data.types[1] !== "null" ? typesInTeamResults[index].data.types[1] : ""}>
                        <DefensivePokemonMatchup matchup={matchup} id={team[index].id} />
                    </ThemedBox>
                ))
                }

            </div> }

            { selectedView === Views.OFFENSIVE_TYPE && <div className={styles.typeContainer}>
                {allTypes.map(type => {
                    // For each type, get each member's matchup against it as and object array [{id, value}], to be passed to component
                    const eachMemberThisTypeMatchup = allOffensiveMatchups.map((matchup, index) => {
                        return {
                            id: team[index].id,
                            value: matchup[type],
                        }
                    })

                    return (
                        <IndividualType key={type} type={type} pokemonMatchups={eachMemberThisTypeMatchup} />
                    )
                })}
            </div> }

            { selectedView === Views.OFFENSIVE_POKEMON && <div className={styles.typeContainer}>
                {allOffensiveMatchups.map((matchup, index) => (
                    <ThemedBox key={index} type1={typesInTeamResults[index].data.types[0]} type2={typesInTeamResults[index].data.types[1] !== "null" ? typesInTeamResults[index].data.types[1] : ""}>
                        <OffensivePokemonMatchup matchup={matchup} id={team[index].id} />
                    </ThemedBox>
                ))
                }

            </div> }
        </div>
    )
}
