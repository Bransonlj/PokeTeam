import React from 'react'
import styles from './Stats.module.scss';
import ThemedBox from '../components/ThemedBox';

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

const getStatTotal = (stats) => {
    let total = 0;
    Object.keys(StatKeys).map(stat => {total += getStatValue(StatKeys[stat].value, stats);})
    return total;

}

export default function Stats({ stats, types }) {
    return (
        <div className={styles.mainContainer}>
            <label>Stats</label>
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
                            <tr>
                                <th>
                                    Total: {getStatTotal(stats)}
                                </th>
                                <td className={styles.emptyTD}/>
                            </tr>

                        </tbody>
                    </table>
                </div>
        </div>
    )
}
