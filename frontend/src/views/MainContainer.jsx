import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import PokemonListContainer from './PokemonList/PokemonListContainer';
import PokemonInfoContainer from './PokemonInfo/PokemonInfoContainer';
import TeamBuilderContainer from './TeamBuilder/TeamBuilderContainer';
import useTeam from './hooks/useTeam';
import PokedexSelector from './PokemonList/PokedexSelector';
import styles from './MainContainer.module.scss';
import { createTeamFromHex, teamToHex } from '../utils/team';
import useLoadingTeamHex from './hooks/useLoadingTeamHex';
import { useTeamContext } from './hooks/useTeamContext';


export default function MainContainer() {
    const [selectedPokedex, setSelectedPokedex] = useState("");
    const [selectedPokemon, setSelectedPokemon] = useState("");
    const [selectedVariety, setSelectedVariety] = useState("");

    const { gen: generation, version: versionGroup } = useParams();

    const { teamHex, setTeamHex, isLoadFromHex, clearLoadedTeam, isError: isErrorLoadingHex , clearError } = useLoadingTeamHex();

    const { team, setTeam } = useTeamContext();

    // determine whether to load team from hexcode or localstorage.
    useEffect(() => {
        if (isLoadFromHex) {
            setTeam(createTeamFromHex(teamHex));
        } else {
            setTeam(createTeamFromHex(localStorage.getItem(`team-${versionGroup}`)));
        }

    }, [isLoadFromHex])

    useEffect(() => {
        // reload team and unselect pokemon when new versionGroup is selected.
        if (!isLoadFromHex) {
            console.log("loading team from storage")
            setTeam(createTeamFromHex(localStorage.getItem(`team-${versionGroup}`)));
        }
        setSelectedPokemon("")
        setSelectedVariety("");
    }, [versionGroup])

    useEffect(() => {
        // only save team to cache if not loading team from code.
        if (!isLoadFromHex) {
            console.log("saving to current team")
            localStorage.setItem(`team-${versionGroup}`, teamToHex(team))
        }

    }, [team])

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
                        versionGroup={versionGroup} 
                    />
                    { selectedPokedex && 
                        <PokemonListContainer 
                            pokedex={ selectedPokedex } 
                            setSelectedPokemon={(setSelectedPokemon)} /> }
                </div>
                { selectedPokemon && 
                    <PokemonInfoContainer 
                        className={styles.pokemonInfoContainer} 
                        pokemon={selectedPokemon} 
                        versionGroup={versionGroup} 
                        selectedVariety={selectedVariety} 
                        setSelectedVariety={setSelectedVariety} 
                        setSelectedPokemon={setSelectedPokemon} /> }
            </div>
            <div className={styles.teamBuilderContainer}>
                <TeamBuilderContainer 
                    clearError={clearError}
                    isErrorLoadingHex={isErrorLoadingHex}
                    clearLoadedTeam={clearLoadedTeam}
                    isLoadFromHex={isLoadFromHex}
                    teamHex={teamHex}
                    setTeamHex={setTeamHex}
                    generation={generation} 
                    versionGroup={versionGroup} 
                    setSelectedVariety={setSelectedVariety} 
                    setSelectedPokemon={setSelectedPokemon} />
            </div>
        </div>
    )
}
