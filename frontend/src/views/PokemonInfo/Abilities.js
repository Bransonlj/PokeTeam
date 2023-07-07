import React from 'react'
import styles from './Abilities.module.scss'
import { formatName } from '../../utils/formatters'

export default function Abilities({ abilities }) {
  return (
    <div>
      <h2>Ability</h2>
      <div className={styles.abilityContainer}>
        { abilities.map(ability => (
            <p key={ ability.ability.name }> { formatName(ability.ability.name) + (ability.is_hidden ? " (hidden)" : '') }</p>

        )) }
      </div>
    </div>
  )
}
