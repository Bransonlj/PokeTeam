import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import PokemonInfoContainer from './PokemonInfo/PokemonInfoContainer';
import TeamBuilderContainer from './TeamBuilder/TeamBuilderContainer';
import styles from './MainContainer.module.scss';
import { usePokemonContext } from './hooks/usePokemonContext';
import PokedexListContainer from './PokedexList/PokedexListContainer';


export default function MainContainer() {
    const { species, setSpecies, setVariety } = usePokemonContext();
    const { gen: generation, version: versionGroup } = useParams();

    useEffect(() => {
        // unselect pokemon when new versionGroup is selected.
        setSpecies("")
        setVariety("");
    }, [versionGroup])

    const { isLoading, error, data, isFetching } = useQuery({
        queryKey: [versionGroup],
        queryFn: async () => axios
                .get(`https://pokeapi.co/api/v2/version-group/${versionGroup}`)
                .then((res) => res.data)
    })

    if (isLoading) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message

    return (
        <div className={styles.mainContainer}>
            <div className={styles.pokedexContainer}>
                <PokedexListContainer pokedexes={data.pokedexes}/>
                { species && 
                    <PokemonInfoContainer 
                        className={styles.pokemonInfoContainer} /> 
                }
            </div>
            <div className={styles.teamBuilderContainer}>
                <TeamBuilderContainer />
            </div>
        </div>
    )
}
