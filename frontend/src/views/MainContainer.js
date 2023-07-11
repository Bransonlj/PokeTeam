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
    const [isValidTeamURL, setIsValidTeamURL] = useState(false);
    const { gen: generation, version: versionGroup } = useParams();

    // get team from url if applicable
    const [searchParams, setSearchParams] = useSearchParams();
    const teamHex = searchParams.get("team")

    const { team, 
        isError, 
        errorMessage, 
        addMember,
        deleteMember, 
        updateMember, 
        loadTeam 
    } = useTeam(createTeamFromHex(localStorage.getItem(`team-${versionGroup}`)));

    useEffect(() => {
        if (isValidTeamHex(teamHex)) {
            console.log("valid")
            setIsValidTeamURL(true);
            loadTeam(createTeamFromHex(teamHex))
        } else {
            console.log("invalid")
            setIsValidTeamURL(false);
        }
    }, [teamHex])

    useEffect(() => {
        // only save team to cache if not loading team from url.
        if (!isValidTeamURL) {
            localStorage.setItem(`team-${versionGroup}`, teamToHex(team))
        }

    }, [team])

    useEffect(() => {
        // reload team and unselect pokemon when new versionGroup is selected.
        if (!isValidTeamURL) {
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
