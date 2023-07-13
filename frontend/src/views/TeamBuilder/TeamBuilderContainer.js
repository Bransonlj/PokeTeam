import React, { useEffect, useState } from 'react'
import TeamMember from './TeamMember'
import TypeMatchups from './TypeMatchups'
import styles from './TeamBuilderContainer.module.scss'
import EmptyMember from './EmptyMember'
import { teamToHex } from '../../utils/team'
import Tippy from '@tippyjs/react'

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
                <label>Code: </label>
                <input 
                    value={inputHex}
                    onChange={(e) => setInputHex(e.target.value)}
                />
                <button type='button' onClick={() => loadHex()}>Load Team</button>
                <button type='button' onClick={() => setIsShowCode(!isShowCode)}>Share Team</button>
                {isShowCode &&<div>
                    <label>Code:</label>
                    <input readOnly={true} value={teamToHex(team)} />
                    <button onClick={() => navigator.clipboard.writeText(teamToHex(team))}>Copy</button>
                    <label>Link:</label>
                    <input readOnly={true} value={window.location.href.split("?")[0] + "?team=" + teamToHex(team)}/>
                    <button onClick={() => navigator.clipboard.writeText(window.location.href.split("?")[0] + "?team=" + teamToHex(team))}>Copy</button>
                </div>
                }   
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
            <Tippy content={<p>Type matchups does not take into account pokemon abilites that can affect specific matchups (e.g. Levitate, Flash Fire)</p>}>
                <h2>Team Analysis</h2>
            </Tippy>
            <TypeMatchups team={team} generation={generation} />

        </div>
    )
}
