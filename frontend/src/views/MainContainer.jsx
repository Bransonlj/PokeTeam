import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import PokemonListContainer from './PokemonList/PokemonListContainer';
import PokemonInfoContainer from './PokemonInfo/PokemonInfoContainer';
import TeamBuilderContainer from './TeamBuilder/TeamBuilderContainer';
import PokedexSelector from './PokemonList/PokedexSelector';
import styles from './MainContainer.module.scss';
import { createTeamFromHex, teamToHex } from '../utils/team';
import useLoadingTeamHex from './hooks/useLoadingTeamHex';
import { useTeamContext } from './hooks/useTeamContext';
import { usePokemonContext } from './hooks/usePokemonContext';


export default function MainContainer() {
    const [selectedPokedex, setSelectedPokedex] = useState("");

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
                <div className={styles.pokedexListContainer}>
                    <PokedexSelector 
                        selectedPokedex={selectedPokedex} 
                        setSelectedPokedex={setSelectedPokedex} 
                        pokedexes={data.pokedexes}
                    />
                    { selectedPokedex && 
                        <PokemonListContainer 
                            pokedex={ selectedPokedex } /> }
                </div>
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
