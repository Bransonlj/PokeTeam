import React from 'react'
import classNames from 'classnames'
import styles from './ThemedBox.module.scss';

export default function ({ children, type1, type2 }) {
  return (
    <div className={classNames(styles[`type1-${type1}`], type2 ? styles[`type2-${type2}`] : "")}>
        {children}
    </div>
  )
}
