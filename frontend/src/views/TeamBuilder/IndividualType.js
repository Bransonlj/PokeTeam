import React from 'react'
import styles from './IndividualType.module.scss'
import classNames from 'classnames'
import { formatName } from '../../utils/formatters'

const valueToEffectiveness = (value) => {
  switch (value) {
    case 0:
      return "immune";
    case 0.25:
      return "notEffectiveX4";
    case 0.5:
      return "notEffectiveX2";
    case 1:
      return "effective";
    case 2:
      return "superEffectiveX2";
    case 4:
      return "superEffectiveX4";
    default:
      return "unknown"
  }
}

export default function IndividualType({ type, pokemonMatchups }) {
  return (
    <div className={classNames(styles.cardContainer, styles[`type-${type}`])}>
        <span className={classNames(styles.type, styles[type])}>{ formatName(type) }</span>
        <div className={styles.matchupContainer}>
          {pokemonMatchups.map(pokemon => (
              <p className={styles[valueToEffectiveness(pokemon.value)]} key={pokemon.name}>{formatName(pokemon.name)} <p> x{pokemon.value}</p></p>
          ))}
        </div>
    </div>
  )
}
