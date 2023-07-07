import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React from 'react'
import styles from './Location.module.scss'

export default function Location({ variety, encounterURL, versionGroup }) {

    const { isLoading: isLoadingVersions, error: versionsError, data: versionsData, isFetching: isFetchingVersions } = useQuery({
        queryKey: ['versionGroup', versionGroup],
        queryFn: () =>
            axios
                .get(`https://pokeapi.co/api/v2/version-group/${versionGroup}`)
                .then((res) => res.data),
    })

    const { isLoading: isLoadingLocations, error: locationsError, data: locationsData, isFetching: isFetchingLocations } = useQuery({
        queryKey: ['PokemonLocation', variety],
        queryFn: () =>
            axios
                .get(encounterURL)
                .then((res) => res.data),
    })


    if (isLoadingLocations || isLoadingVersions) return 'Loading...'

    if (locationsError) return 'An error has occurred: ' + locationsError.message

    if (versionsError) return 'An error has occurred: ' + versionsError.message

    const versions = versionsData.versions.map(version => version.name);

    // returns array of {name, [versions]}, where versions belong to given version group
    const versionLocations = locationsData.map(location => {
        return {
            name: location.location_area.name,
            versions: location.version_details.filter(detail => versions.includes(detail.version.name)).map(detail => detail.version.name)
        }
    }).filter(location => location.versions.length > 0);

    return (
        <div className={styles.container}>
            <h2>Location</h2>
            <div className={styles.locationContainer}>
                {versionLocations.map((location, index) => (
                    <p key={index}>{location.name} {location.versions.length !== versions.length ? location.versions.join(", ") : ""}</p>
                ))}
                {versionLocations.length === 0 && <p>None</p>}
            </div>

        </div>
  )
}
