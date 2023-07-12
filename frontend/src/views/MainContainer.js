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
import { isValidTeamHex, createTeamFromHex, teamToHex } from '../utils/team';


export default function MainContainer() {
    const [selectedPokedex, setSelectedPokedex] = useState("");
    const [selectedPokemon, setSelectedPokemon] = useState("");
    const [selectedVariety, setSelectedVariety] = useState("");

    const { gen: generation, version: versionGroup } = useParams();

    // get team from url if applicable
    const [searchParams, setSearchParams] = useSearchParams();
    const clearLoadedTeam = () => {
        if (searchParams.has("team")) {
            searchParams.delete("team");
            console.log("setting params:", { searchParams: searchParams.toString() });
            console.dir(searchParams.toString());
            setSearchParams(searchParams);
        } else {
            setLoadedTeamHex("");
        }

    }

    const [isLoadedFromHex, setIsLoadedFromHex] = useState(false);
    // for use to communicate teamHex with TeamBuilder Component.
    const [loadedTeamHex, setLoadedTeamHex] = useState("");

    const { team, 
        isError, 
        errorMessage, 
        addMember,
        deleteMember, 
        updateMember, 
        loadTeam 
    } = useTeam(createTeamFromHex(localStorage.getItem(`team-${versionGroup}`)));

    useEffect(() => {
        setLoadedTeamHex(searchParams.get("team"))
    }, [searchParams])

    // when teamHex changes, check and set isLoadedFromHex to validity.
    useEffect(() => {
        if (isValidTeamHex(loadedTeamHex)) {
            console.log("valid")
            setIsLoadedFromHex(true);
            // LoadedTeamHex should only be defined if the teamHex from URL is valid
        } else {
            console.log("invalid") 
            setIsLoadedFromHex(false);

        }
    }, [loadedTeamHex])

    useEffect(() => {
        if (isLoadedFromHex) {
            loadTeam(createTeamFromHex(loadedTeamHex));
        } else {
            loadTeam(createTeamFromHex(localStorage.getItem(`team-${versionGroup}`)));
        }

    }, [isLoadedFromHex])

    useEffect(() => {
        // only save team to cache if not loading team from code.
        if (!isLoadedFromHex) {
            localStorage.setItem(`team-${versionGroup}`, teamToHex(team))
        }

    }, [team])

    useEffect(() => {
        // reload team and unselect pokemon when new versionGroup is selected.
        if (!isLoadedFromHex) {
            console.log("versiongroup:", isLoadedFromHex)
            console.log("loading from storage")
            loadTeam(createTeamFromHex(localStorage.getItem(`team-${versionGroup}`)));
        }
        setSelectedPokemon("")
        setSelectedVariety("");
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
                        addMember={addMember} 
                        selectedVariety={selectedVariety} 
                        setSelectedVariety={setSelectedVariety} 
                        setSelectedPokemon={setSelectedPokemon} /> }
            </div>
            <div className={styles.teamBuilderContainer}>
                <TeamBuilderContainer 
                    clearLoadedTeam={clearLoadedTeam}
                    isLoadedFromHex={isLoadedFromHex}
                    loadedTeamHex={loadedTeamHex}
                    setLoadedTeamHex={setLoadedTeamHex}
                    generation={generation} 
                    versionGroup={versionGroup} 
                    team={team} 
                    isError={isError} 
                    errorMessage={errorMessage} 
                    deleteMember={deleteMember} 
                    updateMember={updateMember} 
                    setSelectedVariety={setSelectedVariety} 
                    setSelectedPokemon={setSelectedPokemon} />
            </div>
        </div>
    )
}
