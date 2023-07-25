import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import styles from './GenerationNav.module.scss'
import { useBaseURL } from '../../utils/urls';

const activeClassName = ({ isActive }) => isActive ? `${styles.active}` : "";

const Generations = {
  I: 1,
  II: 2,
  III: 3,
  IV: 4,
  V: 5,
  VI: 6,
  VII: 7,
  VIII: 8,
  IX: 9,
}

export default function GenerationNav() {
  return (
    <div className={styles.container} style={{ height: `100%` }}>
      <nav className={styles.navbar}>
        <NavLink to={useBaseURL("/home")}>Home</NavLink>
        {Object.keys(Generations).map(gen => (
          <NavLink key={gen} className={activeClassName} to={useBaseURL(`/generation/${Generations[gen]}`)}>Gen {gen}</NavLink>
        ))}
      </nav>
      <div className={styles.content}>
        <Outlet />
      </div>

    </div>
  )
}
