import React, { useState } from 'react'
import styles from './Collapsible.module.scss'
import classNames from 'classnames';

export default function Collapsible({ children, title }) {
    const [isShow, setIsShow] = useState(false);

  return (
    <div>
        <label onClick={() => setIsShow(!isShow)}>{ title } </label>
        <div className={classNames(styles.content, (isShow ? styles.showing : ""))}>
                {children}
        </div>
    </div>
  )
}
