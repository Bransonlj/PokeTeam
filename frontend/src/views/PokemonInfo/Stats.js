import React from 'react'
import styles from './Stats.module.scss';

const getStatValue = (statName, stats) => {
    return stats.find(stat => stat.stat.name === statName).base_stat;
}

const statBarStyle = (statValue) => {
    return {
        width: `${100 * statValue / 255}%`,
    };
}

const StatKeys = {
    HP: {value: "hp", label: "HP"},
    ATTACK: {value: "attack", label: "Attack"},
    DEFENSE: {value: "defense", label: "Defense"},
    SPECIAL_ATTACK: {value: "special-attack", label: "Sp. Atk"},
    SPECIAL_DEFENSE: {value: "special-defense", label: "Sp. Def"},
    SPEED: {value: "speed", label: "Speed"},
}

export default function Stats({ stats }) {
    return (
        <div className={styles.mainContainer}>
            <h2>Stats</h2>
            <div className={styles.tableContainer}>
                <table className={styles.statTable}>
                    <tbody>
                        {
                            Object.keys(StatKeys).map(stat => (
                                <tr>
                                    <th>{StatKeys[stat].label}: {getStatValue(StatKeys[stat].value, stats)}</th>
                                    <td className={styles.statBarCell}>
                                        <div className={styles.statBar} style={statBarStyle(getStatValue(StatKeys[stat].value, stats))} />
                                    </td>
                                </tr>
                            ))
                        }

                    </tbody>
                </table>
            </div>
        </div>
    )
}
