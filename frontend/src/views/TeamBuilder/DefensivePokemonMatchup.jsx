import React from 'react'
import classNames from 'classnames';
import styles from './PokemonMatchup.module.scss';
import { getSpriteURL } from '../../utils/urls';
import { formatName } from '../../utils/formatters';

export default function DefensivePokemonMatchup({ matchup, id }) {

    const x4weak = Object.keys(matchup).filter(type => matchup[type] === 4);
    const x2weak = Object.keys(matchup).filter(type => matchup[type] === 2);
    const x2resist = Object.keys(matchup).filter(type => matchup[type] === 0.5);
    const x4resist = Object.keys(matchup).filter(type => matchup[type] === 0.25);
    const immune = Object.keys(matchup).filter(type => matchup[type] === 0)

    return (
        <div className={classNames(styles.container)}>
            <img className={styles.sprite} src={getSpriteURL(id)} />
            <div className={styles.allMatchups}>
                <div>
                    <label>Immune</label>
                    <div className={styles.matchupContainer}>
                        {immune.map(type => (
                            <span key={type} className={classNames( styles.type, styles[type]) }>{formatName(type)}</span>
                        ))}
                    </div>
                </div>

                <div>
                    <label>Resist x4</label>
                    <div className={styles.matchupContainer}>
                        {x4resist.map(type => (
                            <span key={type} className={classNames( styles.type, styles[type]) }>{formatName(type)}</span>
                        ))}
                    </div>
                </div>

                <div>
                    <label>Resist x2</label>
                    <div className={styles.matchupContainer}>
                        {x2resist.map(type => (
                            <span key={type} className={classNames( styles.type, styles[type]) }>{formatName(type)}</span>
                        ))}
                    </div>
                </div>

                <div>
                    <label>Weakness x2</label>
                    <div className={styles.matchupContainer}>
                        {x2weak.map(type => (
                            <span key={type} className={classNames( styles.type, styles[type]) }>{formatName(type)}</span>
                        ))}
                    </div>
                </div>

                <div>
                    <label>Weakness x4</label>
                    <div className={styles.matchupContainer}>
                        {x4weak.map(type => (
                            <span key={type} className={classNames( styles.type, styles[type]) }>{formatName(type)}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>

    )
}
