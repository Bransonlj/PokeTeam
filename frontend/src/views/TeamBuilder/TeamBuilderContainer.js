import React, { useState } from 'react'
import TeamMember from './TeamMember'
import TypeMatchups from './TypeMatchups'
import styles from './TeamBuilderContainer.module.scss'
import EmptyMember from './EmptyMember'
import Collapsible from 'react-collapsible'

export default function TeamBuilderContainer({ generation, versionGroup, team, isError, errorMessage, deleteMember, updateMember, setSelectedVariety, setSelectedPokemon }) {

    console.log("TEAMBUILDER RERENDERS")
    return (
        <div>
            <div className={styles.teamBuilderContainer}>
                {isError && <p>{errorMessage}</p>}
                { team.map((member, index) => (
                    <div className={styles.memberContainer}>
                        <TeamMember 
                            key={index} 
                            versionGroup={versionGroup} 
                            member={member} 
                            deleteMember={deleteMember} 
                            index={index} 
                            updateMemeber={updateMember} 
                            setSelectedVariety={setSelectedVariety} 
                            setSelectedPokemon={setSelectedPokemon} 
                        />
                    </div>
                )) }
                {   // add empty team slots for remaining team slots
                    team.length < 6 && Array(6 - team.length).fill(0).map(x => (
                        <div className={styles.memberContainer}>
                            <EmptyMember />
                        </div>
                    ))
                }
            </div>
            <Collapsible classParentString ={styles.testing} trigger="Type Matchups">
                <TypeMatchups team={team} generation={generation} />
            </Collapsible>
        </div>
    )
}
