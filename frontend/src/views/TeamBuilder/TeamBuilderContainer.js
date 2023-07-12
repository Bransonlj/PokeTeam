import React, { useEffect, useState } from 'react'
import TeamMember from './TeamMember'
import TypeMatchups from './TypeMatchups'
import styles from './TeamBuilderContainer.module.scss'
import EmptyMember from './EmptyMember'
import { teamToHex } from '../../utils/team'

export default function TeamBuilderContainer({ clearError, isErrorLoadingHex, clearLoadedTeam, isLoadFromHex, teamHex, setTeamHex, generation, versionGroup, team, isError, errorMessage, deleteMember, updateMember, setSelectedVariety, setSelectedPokemon }) {

    const [isShowCode, setIsShowCode] = useState(false);
    const [inputHex, setInputHex] = useState(teamHex ?? "");

    // use to prevent actions on invalid team (e.g. saving). Defaulted to true.
    const [isTeamValid, setIsTeamValid] = useState(true);

    useEffect(() => {
        // reset to true if team changed, member component will check each member validity.
        setIsTeamValid(true)
    }, [team])

    const loadHex = () => {
        setTeamHex(inputHex);
    }

    const saveTeam = () => {
        // loadHex always validates team
        if (isTeamValid) {
            localStorage.setItem(`team-${versionGroup}`, teamToHex(team));
            clearLoadedTeam();
            setInputHex("")
        } else {
            console.log("invalid team cannot save...")
        }
    }

    return (
        <div>
            <div className={styles.loadSaveContainer}>
                {isErrorLoadingHex &&
                    <div>
                        <p>errorLoadingTeam</p>
                        <button type='button' onClick={() => clearError()}>X</button>
                    </div>    
                }
                {isLoadFromHex && 
                    <div>
                        <label>Current team is being loaded from code. Pokemon's moves will not be correctly loaded if team is from a different version.</label>
                        <button type='button' onClick={() => clearLoadedTeam()}>Clear</button>
                        <button type='button' onClick={saveTeam}>Save</button>
                    </div>
                }
                <label>Load Team: </label>
                <input 
                    value={inputHex}
                    onChange={(e) => setInputHex(e.target.value)}
                />
                <button type='button' onClick={() => loadHex()}>Load</button>
                <button type='button' onClick={() => setIsShowCode(true)}>Get Code</button>
                {isShowCode && <label>{teamToHex(team)}</label>}
            </div>
            <div className={styles.teamBuilderContainer}>

                { team.map((member, index) => (
                    <div key={index} className={styles.memberContainer}>
                        <TeamMember 
                            setIsTeamValid={setIsTeamValid}
                            versionGroup={versionGroup} 
                            member={member} 
                            deleteMember={deleteMember} 
                            memberIndex={index} 
                            updateMemeber={updateMember} 
                            setSelectedVariety={setSelectedVariety} 
                            setSelectedPokemon={setSelectedPokemon} 
                        />
                    </div>
                )) }
                {   // add empty team slots for remaining team slots
                    team.length < 6 && Array(6 - team.length).fill(0).map((x, index) => (
                        <div key={index} className={styles.memberContainer}>
                            <EmptyMember />
                        </div>
                    ))
                }
            </div>
            <h2>Team Analysis</h2>
            <TypeMatchups team={team} generation={generation} />

        </div>
    )
}
