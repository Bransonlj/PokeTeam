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


export default function TeamMember({ versionGroup, member, deleteMember, updateMemeber, index, setSelectedVariety, setSelectedPokemon }) {

    const { isLoading, error, data, isFetching } = useQuery({
        queryKey: ['PokemonVarietyInfo', member.name],
        queryFn: () =>
            axios
                .get(`https://pokeapi.co/api/v2/pokemon/${member.name}`)
                .then((res) => res.data),
    })
    if (isLoading) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message

    const versionMoves = filterByVersion(data?.moves, versionGroup);

    const uniqueMoves = versionMoves?.map(move => formatName(move.move.name)).sort();

    const uniqueAbilities = data.abilities.map(ability => formatName(ability.ability.name));

    return (
        <>
            {member && <div className={classNames(styles.memberContainer, styles[`type1-${member.type1}`], styles[member.type2 ? `type2-${member.type2}` : ""])}>
                <div className={styles.infoContainer}>
                    <div className={styles.nameContainer}>
                        <label onClick={ () => {setSelectedVariety(member.name); setSelectedPokemon(member.species);} }> { formatName(member.name) }</label>
                        <button type='button' className={styles.removeButton} onClick={() => deleteMember(index)}>x</button>
                    </div>
                    
                    <img className={styles.sprite} onClick={ () => {setSelectedVariety(member.name); setSelectedPokemon(member.species);} } src={getSpriteURL(member.id)}></img>
                    <div className={styles.typeContainer}>
                        <span className={classNames(styles.type, styles[member.type1])}>{ formatName(member.type1) }</span>
                        {member.type2 && <span className={classNames(styles.type, styles[member.type2])}>{ formatName(member.type2) }</span>}
                    </div>
                    <DropdownList 
                        busy={isLoading} 
                        data={uniqueAbilities}
                        placeholder='abilities'
                        value={member.ability}
                        onChange={(value) => updateMemeber({...member, ability: value}, index)}
                    />
                </div>
                <div className={styles.movesContainer}>
                    <span className={styles.moveSelector}>
                        <DropdownList 
                            busy={isLoading} 
                            data={uniqueMoves}
                            placeholder='select move...'
                            value={member.move1}
                            onChange={(value) => updateMemeber({...member, move1: value}, index)}
                        />
                    </span>
                    <span className={styles.moveSelector}>
                        <DropdownList 
                            busy={isLoading} 
                            data={uniqueMoves}
                            placeholder='select move...'
                            value={member.move2}
                            onChange={(value) => updateMemeber({...member, move2: value}, index)}
                        />
                    </span>
                    <span className={styles.moveSelector}>
                        <DropdownList 
                            busy={isLoading} 
                            data={uniqueMoves}
                            placeholder='select move...'
                            value={member.move3}
                            onChange={(value) => updateMemeber({...member, move3: value}, index)}
                        />
                    </span>
                    <span className={styles.moveSelector}>
                        <DropdownList 
                            busy={isLoading} 
                            data={uniqueMoves}
                            placeholder='select move...'
                            value={member.move4}
                            onChange={(value) => updateMemeber({...member, move4: value}, index)}
                        />
                    </span>
                </div>
            </div>}
        </>
    )
}
