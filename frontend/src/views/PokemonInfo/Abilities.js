import React from 'react'
import styles from './Abilities.module.scss'
import { formatName } from '../../utils/formatters'

export default function Abilities({ abilities }) {
  return (
    <div className={styles.container}>
      <label>Ability</label>
      <div className={styles.abilityContainer}>
        { abilities.map(ability => (
            <p key={ ability.ability.name }> { formatName(ability.ability.name) + (ability.is_hidden ? " (hidden)" : '') }</p>

        )) }
      </div>
    </div>
  )
}
