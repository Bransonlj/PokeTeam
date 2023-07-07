import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React from 'react'
import { NavLink, Outlet, useParams } from 'react-router-dom'
import styles from './VersionNav.module.scss';

const VERSION_GROUP_EXCLUSION_LIST = [
    "colosseum",
    "xd",
    "the-isle-of-armor", 
    "the-crown-tundra",
    "the-teal-mask",
    "the-indigo-disk",
]

const activeClassName = ({ isActive }) => isActive ? `${styles.active}` : "";

export default function VersionNav() {

    const { gen } = useParams()
    const { isLoading, error, data, isFetching } = useQuery({
        queryKey: [gen],
        queryFn: () =>
          axios
            .get(`https://pokeapi.co/api/v2/generation/${gen}`)
            .then((res) => res.data),
      })

    if (isLoading) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message

    return (
        <div className={styles.container} >
            <nav className={styles.navbar}>
                {data.version_groups.map((version, index) => {
                    if (!VERSION_GROUP_EXCLUSION_LIST.includes(version.name)) {
                        return (
                            <NavLink className={activeClassName} key={index} to={`/generation/${gen}/${version.name}`}><img className={styles.versionLogo} src={`/versions/${version.name}.png`} alt={version.name} /></NavLink>
                        )
                    }
                })}
            </nav>
            <div className={styles.content}>
                <Outlet />
            </div>
        </div>
    )
    }
