import React, { useState } from 'react'
import styles from './Collapsible.module.scss'
import classNames from 'classnames';

export default function Collapsible({ children, title }) {
    const [isShow, setIsShow] = useState(false);

  return (
    <div>
        <div className={styles.header} onClick={() => setIsShow(!isShow)}>{ title } </div>
        <div className={classNames(styles.content, (isShow ? styles.showing : ""))}>
            {children}
        </div>
    </div>
  )
}
