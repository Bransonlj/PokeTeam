import React from 'react'
import styles from './TeamMember.module.scss'
import classNames from 'classnames'

export default function EmptyMember() {
  return (
    <div className={classNames(styles.memberContainer, styles.empty)}>
        <img src='/pokeball.png' className={styles.sprite} />
    </div>
  )
}
