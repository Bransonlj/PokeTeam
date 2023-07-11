import React, { useState } from 'react'
import TeamMember from './TeamMember'
import TypeMatchups from './TypeMatchups'
import styles from './TeamBuilderContainer.module.scss'
import EmptyMember from './EmptyMember'

export default function TeamBuilderContainer({ generation, versionGroup, team, isError, errorMessage, deleteMember, updateMember, setSelectedVariety, setSelectedPokemon }) {

    return (
        <div>
                <div className={styles.loadSaveContainer}>
                    <label>Load Team: </label>
                    <input />
                    <button type='button'>Load</button>
                    <button type='button'>Get Code</button>
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
