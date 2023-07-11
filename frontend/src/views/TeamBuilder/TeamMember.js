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

export default function TeamMember({ versionGroup, member, deleteMember, updateMemeber, memberIndex, setSelectedVariety, setSelectedPokemon }) {

    // memeber object = {id, abilityIndex, move1Index...move4Index}
    const { isLoading, error, data } = useFetchVariety(member.id);

    if (isLoading) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message

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
                        <label onClick={ () => {setSelectedVariety(data.name); setSelectedPokemon(data.species.name);} }> { formatName(data.name) }</label>
                        <button type='button' className={styles.removeButton} onClick={() => deleteMember(memberIndex)}>x</button>
                    </div>
                    
                    <img className={styles.sprite} onClick={ () => {setSelectedVariety(data.name); setSelectedPokemon(data.species.name);} } src={getSpriteURL(member.id)}></img>
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
                        onChange={(value) => updateMemeber({...member, abilityIndex: value.id}, memberIndex)}
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
                            onChange={(value) => updateMemeber({...member, move1Index: value.id}, memberIndex)}
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
                            onChange={(value) => updateMemeber({...member, move2Index: value.id}, memberIndex)}
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
                            onChange={(value) => updateMemeber({...member, move3Index: value.id}, memberIndex)}
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
                            onChange={(value) => updateMemeber({...member, move4Index: value.id}, memberIndex)}
                        />
                    </span>
                </div>
            </div>}
        </>
    )
}
