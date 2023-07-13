import { getSpriteURL } from "../../utils/urls";
import styles from './OffensiveMatchup.module.scss'
import classNames from "classnames";
import { formatName } from '../../utils/formatters'
import useFetchVariety from "../hooks/useFetchVariety";

export default function OffensiveMatchup({ matchup, id }) {

    const supereffective = Object.keys(matchup).filter(type => matchup[type] > 1);
    const inefffective = Object.keys(matchup).filter(type => matchup[type] < 1 && matchup[type] > 0);
    const immune = Object.keys(matchup).filter(type => matchup[type] === 0)

    return (
        <div className={classNames(styles.container)}>
            <img className={styles.sprite} src={getSpriteURL(id)} />
            <div className={styles.allMatchups}>
                <div>
                    <label>Super Effective</label>
                    <div className={styles.matchupContainer}>
                        {supereffective.map(type => (
                            <span className={classNames( styles.type, styles[type]) }>{formatName(type)}</span>
                        ))}
                    </div>
                </div>
                <div>
                    <label>Not Effective</label>
                    <div className={styles.matchupContainer}>
                        {inefffective.map(type => (
                            <span className={classNames( styles.type, styles[type]) }>{formatName(type)}</span>
                        ))}
                    </div>
                </div>
                <div>
                    <label>Immune</label>
                    <div className={styles.matchupContainer}>
                        {immune.map(type => (
                            <span className={classNames( styles.type, styles[type]) }>{formatName(type)}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>

    )
}
