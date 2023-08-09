import React, { useEffect, useState } from 'react'
import TeamMember from './TeamMember'
import TypeMatchups from './TypeMatchups'
import styles from './TeamBuilderContainer.module.scss'
import EmptyMember from './EmptyMember'
import { createTeamFromHex, teamToHex } from '../../utils/team'
import Tippy from '@tippyjs/react'
import { useTeamContext } from '../hooks/useTeamContext'
import { useParams } from 'react-router-dom'
import useLoadingTeamHex from '../hooks/useLoadingTeamHex'

export default function TeamBuilderContainer() {

    const { team, setTeam } = useTeamContext();
    const { version: versionGroup} = useParams();
    const { teamHex, setTeamHex, isLoadFromHex, clearLoadedTeam, isError: isErrorLoadingHex , clearError } = useLoadingTeamHex();
    const [isShowCode, setIsShowCode] = useState(false);
    const [inputHex, setInputHex] = useState(teamHex ?? "");
    // use to prevent actions on invalid team (e.g. saving). Default to true.
    const [isTeamValid, setIsTeamValid] = useState(true);


    useEffect(() => {
        // determine whether to load team from hexcode or localstorage.
        if (isLoadFromHex) {
            setTeam(createTeamFromHex(teamHex));
        } else {
            setTeam(createTeamFromHex(localStorage.getItem(`team-${versionGroup}`)));
        }
    }, [isLoadFromHex])

    useEffect(() => {
        // reload team from localstorage when new versionGroup is selected.
        if (!isLoadFromHex) {
            setTeam(createTeamFromHex(localStorage.getItem(`team-${versionGroup}`)));
        }
    }, [versionGroup])

    useEffect(() => {
        // reset to true once team changed, TeamMember individually check each member validity based on id and setIsTeamValid.
        setIsTeamValid(true)
        if (!isLoadFromHex) {
            // save current team to storage if not loading from code.
            console.log("saving to current team")
            localStorage.setItem(`team-${versionGroup}`, teamToHex(team))
        }
    }, [team])

    // --- functions ---
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
                            member={member} 
                            memberIndex={index} 
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
            <TypeMatchups team={team} />

        </div>
    )
}
