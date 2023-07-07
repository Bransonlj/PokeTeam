import React, { useEffect, useState } from 'react'
import { calculateRelations, getGenericMatchup } from '../../utils/types'
import { useQueries } from '@tanstack/react-query'
import axios from 'axios'
import IndividualType from './IndividualType'
import styles from './TypeMatchups.module.scss'

export default function TypeMatchups({ team, generation }) {

    const [allTypes, setAllTypes] = useState([]);

    useEffect(() => {
        setAllTypes(Object.keys(getGenericMatchup(generation)));
    }, [generation])

    const typeQueries = team.flatMap(member => {
        if (member.type2) {
            return [
                {
                    queryKey: ["type", member.type1],
                    queryFn: () => 
                        axios
                            .get(`https://pokeapi.co/api/v2/type/${member.type1}`)
                            .then(res => res.data),
                }, {
                    queryKey: ["type", member.type2],
                    queryFn: () => 
                        axios
                            .get(`https://pokeapi.co/api/v2/type/${member.type2}`)
                            .then(res => res.data),
                }]
        } else {
            return [
                {
                    queryKey: ["type", member.type1],
                    queryFn: () => 
                        axios
                            .get(`https://pokeapi.co/api/v2/type/${member.type1}`)
                            .then(res => res.data),
                }, {
                    queryKey: ["type", "null"],
                    queryFn: () => ""
                }]
        }
    })
    
    const typeQueriesResults = useQueries({ queries: typeQueries})

    const isLoadingTypes = typeQueriesResults.some(r => r.isLoading);

    if (isLoadingTypes) {
        return 'Loading Matchups';
    }

    const groupedTypes = [];
    while(typeQueriesResults.length) groupedTypes.push(typeQueriesResults.splice(0,2));
    const allMatchups = groupedTypes.map(typeGroup => calculateRelations(generation, typeGroup[0].data, typeGroup[1].data));

    return (
        <div>
            <div className={styles.typeContainer}>
                {allTypes.map(type => {

                    const eachMemberThisTypeMatchup = allMatchups.map((matchup, index) => {
                        return {
                            name: team[index].name,
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
