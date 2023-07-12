import React, { useState } from 'react'
import TeamMember from './TeamMember'
import TypeMatchups from './TypeMatchups'
import styles from './TeamBuilderContainer.module.scss'
import EmptyMember from './EmptyMember'
import { isValidTeamHex, teamToHex } from '../../utils/team'

export default function TeamBuilderContainer({ clearLoadedTeam, isLoadedFromHex, setSearchParams, loadedTeamHex, setLoadedTeamHex, generation, versionGroup, team, isError, errorMessage, deleteMember, updateMember, setSelectedVariety, setSelectedPokemon }) {

    const [isShowCode, setIsShowCode] = useState(false);
    const [inputHex, setInputHex] = useState(loadedTeamHex ?? "");

    const loadHex = () => {
        if (isValidTeamHex(inputHex)) {
            console.log("setting...")
            setLoadedTeamHex(inputHex);
        }
    }

    return (
        <div>
            <div className={styles.loadSaveContainer}>
                {isLoadedFromHex && 
                    <div>
                        <label>Current team is being loaded from code</label>
                        <button type='button' onClick={() => clearLoadedTeam()}>Clear</button>
                        <button type='button' onClick={() => localStorage.setItem(`team-${versionGroup}`, teamToHex(team))}>Save</button>
                    </div>}
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
