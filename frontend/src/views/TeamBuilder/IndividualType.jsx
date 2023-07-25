import React from 'react'
import styles from './IndividualType.module.scss'
import classNames from 'classnames'
import { formatName } from '../../utils/formatters'
import useFetchVariety from '../hooks/useFetchVariety'
import { useQueries } from '@tanstack/react-query'
import axios from 'axios'

const valueToEffectiveness = (value) => {
  switch (value) {
    case 0:
      return "immune";
    case 0.25:
      return "notEffectiveX4";
    case 0.5:
      return "notEffectiveX2";
    case 1:
      return "effective";
    case 2:
      return "superEffectiveX2";
    case 4:
      return "superEffectiveX4";
    default:
      return "unknown"
  }
}

export default function IndividualType({ type, pokemonMatchups }) {

  const teamQueries = pokemonMatchups.map(matchup => {
    return {
        queryKey: ['PokemonVarietyInfo', matchup.id],
        queryFn: () =>
            axios
                .get(`https://pokeapi.co/api/v2/pokemon/${matchup.id}`)
                .then((res) => res.data),
    }
  })

  const teamQueriesResults = useQueries({ queries: teamQueries})

  const isLoadingPokemon = teamQueriesResults.some(r => r.isLoading);

  if (isLoadingPokemon) {
    return "loading pokemon";
  }

  const nameList = teamQueriesResults.map(r => r.data.name);
  // possible to check for abilities that affect matchup (e.g. levitate)

  return (
    <div className={classNames(styles.cardContainer, styles[`type-${type}`])}>
        <span className={classNames(styles.type, styles[type])}>{ formatName(type) }</span>
        <div className={styles.matchupContainer}>
          {pokemonMatchups.map((matchup, index) => (
              <p className={styles[valueToEffectiveness(matchup.value)]} key={nameList[index]}>{formatName(nameList[index])}  x{matchup.value}</p>
          ))}
        </div>
    </div>
  )
}
