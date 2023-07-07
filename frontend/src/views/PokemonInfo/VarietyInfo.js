import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React from 'react'
import MoveList from './MoveList'
import Abilities from './Abilities'
import Stats from './Stats'
import Location from './Location'
import { getSpriteURL } from '../../utils/urls'
import styles from'./VarietyInfo.module.scss'
import classNames from 'classnames'

export default function VarietyInfo({ species, variety, versionGroup, addMember }) {

    const { isLoading, error, data, isFetching } = useQuery({
        queryKey: ['PokemonVarietyInfo', variety],
        queryFn: () =>
            axios
                .get(`https://pokeapi.co/api/v2/pokemon/${variety}`)
                .then((res) => res.data),
    })
    if (isLoading) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message
    
    const simpleTypes = data.types.map(type => type.type.name);


    return (
        <div className={styles.infoContainer}>

            <div className={styles.summaryCard}>
                <div className={styles.spriteCard}>
                    <img className={styles.sprite} src={ getSpriteURL(data.id) } />
                    <div>
                        { data.types.map(type => (
                            <span key={ type.slot } className={classNames(styles.type, styles[type.type.name])}> { type.type.name }</span>
                        )) }
                    </div>
                    <Abilities abilities={data.abilities} />
                </div>
                <div className={styles.rightSide}>
                    <button type="button" onClick={() => addMember(data.id, variety, species, ...simpleTypes)}>add to team</button>
                    <Stats stats={data.stats} />
                </div>
            </div>
            <Location encounterURL={data.location_area_encounters} variety={variety} versionGroup={versionGroup} />
            <MoveList moves={data.moves} version={versionGroup} />
        </div>
    )
}
