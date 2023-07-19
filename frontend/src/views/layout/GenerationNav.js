import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import styles from './GenerationNav.module.scss'

const activeClassName = ({ isActive }) => isActive ? `${styles.active}` : "";


export default function GenerationNav() {

  return (
    <div className={styles.container} style={{ height: `100%` }}>
      <nav className={styles.navbar}>
        <NavLink to="/home">Home</NavLink>
        <NavLink className={activeClassName} to="/generation/1">Gen i</NavLink>
        <NavLink className={activeClassName} to="/generation/2">Gen ii</NavLink>
        <NavLink className={activeClassName} to="/generation/3">Gen iii</NavLink>
        <NavLink className={activeClassName} to="/generation/4">Gen iv</NavLink>
        <NavLink className={activeClassName} to="/generation/5">Gen v</NavLink>
        <NavLink className={activeClassName} to="/generation/6">Gen vi</NavLink>
        <NavLink className={activeClassName} to="/generation/7">Gen vii</NavLink>
        <NavLink className={activeClassName} to="/generation/8">Gen viii</NavLink>
        <NavLink className={activeClassName} to="/generation/9">Gen ix</NavLink>
      </nav>
      <div className={styles.content}>
        <Outlet />
      </div>

    </div>
  )
}
