import React from 'react'
import { filterByVersion } from '../../utils/moves'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import DropdownList from "react-widgets/DropdownList";
import styles from './TeamMember.module.scss'
import { getSpriteURL } from '../../utils/urls';
import classNames from 'classnames';
import './test.scss';
import { formatName } from '../../utils/formatters';
import useFetchVariety from '../hooks/useFetchVariety';
import { useTeamContext } from '../hooks/useTeamContext';
import { usePokemonContext } from '../hooks/usePokemonContext';

export default function TeamMember({ setIsTeamValid, versionGroup, member, memberIndex }) {

    // memeber object = {id, abilityIndex, move1Index...move4Index}
    const { isLoading, error, isError, data } = useFetchVariety(member.id);

    const { updateMember, deleteMember } = useTeamContext();
    const { setSpecies, setVariety } = usePokemonContext();

    if (isLoading) return 'Loading...'

    if (isError) {
        // error fetching from member pokemon id, assume invalid team member.
        setIsTeamValid(false);
        console.log(error.message)
        return (
            <div>
                <h2>{'Error occured, invalid team member'}</h2>
                <button type='button' className={styles.removeButton} onClick={() => deleteMember(memberIndex)}>x</button>
            </div>
        )
    }

    const types = data.types.map(type => type.type.name);

    const versionMoves = filterByVersion(data?.moves, versionGroup);

    const uniqueMoves = versionMoves?.map(move => formatName(move.move.name))
            .sort() // sort first then map again to ensure final index id will be in order
            .map((move, index) => {return {id: index, name: move}});

    const uniqueAbilities = data.abilities.map((ability, index) => {return { id: index, name: formatName(ability.ability.name)}});
    return (
        <>
            {member && <div className={classNames(styles.memberContainer, styles[`type1-${types[0]}`], styles[types[1] ? `type2-${types[1]}` : ""])}>
                <div className={styles.infoContainer}>
                    <div className={styles.nameContainer}>
                        <label onClick={ () => {setVariety(data.name); setSpecies(data.species.name);} }> { formatName(data.name) }</label>
                        <button type='button' className={styles.removeButton} onClick={() => deleteMember(memberIndex)}>x</button>
                    </div>
                    
                    <img className={styles.sprite} onClick={ () => {setVariety(data.name); setSpecies(data.species.name);} } src={getSpriteURL(member.id)}></img>
                    <div className={styles.typeContainer}>
                        <span className={classNames(styles.type, styles[types[0]])}>{ formatName(types[0]) }</span>
                        {types[1] && <span className={classNames(styles.type, styles[types[1]])}>{ formatName(types[1]) }</span>}
                    </div>
                    <DropdownList 
                        busy={isLoading} 
                        data={uniqueAbilities}
                        dataKey='id'
                        textField='name'
                        placeholder='abilities'
                        value={uniqueAbilities[member.abilityIndex]}
                        onChange={(value) => updateMember("abilityIndex", value.id, memberIndex)}
                    />
                </div>
                <div className={styles.movesContainer}>
                    <span className={styles.moveSelector}>
                        <DropdownList 
                            busy={isLoading} 
                            data={uniqueMoves}
                            dataKey='id'
                            textField='name'
                            placeholder='select move...'
                            value={uniqueMoves[member.move1Index]}
                            onChange={(value) => updateMember("move1Index", value.id, memberIndex)}
                        />
                    </span>
                    <span className={styles.moveSelector}>
                        <DropdownList 
                            busy={isLoading} 
                            data={uniqueMoves}
                            dataKey='id'
                            textField='name'
                            placeholder='select move...'
                            value={uniqueMoves[member.move2Index]}
                            onChange={(value) => updateMember("move2Index", value.id, memberIndex)}
                        />
                    </span>
                    <span className={styles.moveSelector}>
                        <DropdownList 
                            busy={isLoading} 
                            data={uniqueMoves}
                            dataKey='id'
                            textField='name'
                            placeholder='select move...'
                            value={uniqueMoves[member.move3Index]}
                            onChange={(value) => updateMember("move3Index", value.id, memberIndex)}
                        />
                    </span>
                    <span className={styles.moveSelector}>
                        <DropdownList 
                            busy={isLoading} 
                            data={uniqueMoves}
                            dataKey='id'
                            textField='name'
                            placeholder='select move...'
                            value={uniqueMoves[member.move4Index]}
                            onChange={(value) => updateMember("move4Index", value.id, memberIndex)}
                        />
                    </span>
                </div>
            </div>}
        </>
    )
}
