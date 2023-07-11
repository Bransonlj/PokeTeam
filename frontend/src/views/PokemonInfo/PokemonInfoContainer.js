import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import VarietyInfo from './VarietyInfo';
import EvolutionInfo from './EvolutionInfo';
import styles from './PokemonInfoContainer.module.scss'
import Collapsible from '../components/Collapsible'
import classNames from 'classnames';
import { formatName } from '../../utils/formatters';

export default function PokemonInfoContainer({ pokemon, versionGroup, addMember, selectedVariety, setSelectedVariety, setSelectedPokemon }) {
  const { isLoading, error, data, isFetching } = useQuery({
      queryKey: ['PokemonSpeciesInfo', pokemon],
      queryFn: () =>
        axios
          .get(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}`)
          .then((res) => res.data),
  })

  useEffect(() => {
    if (data) {
      setSelectedVariety(data.varieties[0].pokemon.name);
    }
  }, [data])

  if (isLoading) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message
  
  return (

    <div className={styles.container}>
      <div  className={styles.varietySelctor}>
        { data && data.varieties.map((variety, index) => (
            <label 
              key={index} 
              className={classNames(styles.varietyButton, selectedVariety === variety.pokemon.name ? styles.selected : "")} 
              onClick={() => setSelectedVariety(variety.pokemon.name)}
            >{formatName(variety.pokemon.name)}</label>
        )) }
      </div>
      <div className={styles.pokemonInfoContainer}>
        <div className={styles.evolutionContainer}>
          <Collapsible title={<p style={{fontWeight: "bold", margin: "0px"}}>Evolutions</p>}>
            <EvolutionInfo evolutionChainURL={data.evolution_chain.url} setSelectedVariety={setSelectedVariety} setSelectedPokemon={setSelectedPokemon}/>
          </Collapsible>
        </div>
        {selectedVariety && <VarietyInfo species={pokemon} variety={selectedVariety} versionGroup={versionGroup} addMember={addMember} />}
      </div>
    </div>
  )
}
