import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';
import VarietyInfo from './VarietyInfo';
import EvolutionInfo from './EvolutionInfo';
import styles from './PokemonInfoContainer.module.scss';
import Collapsible from '../components/Collapsible';
import classNames from 'classnames';
import { formatName } from '../../utils/formatters';
import { usePokemonContext } from '../hooks/usePokemonContext';

export default function PokemonInfoContainer({ versionGroup }) {

  const { species, variety, setVariety } = usePokemonContext()

  const { isLoading, error, data, isFetching } = useQuery({
      queryKey: ['PokemonSpeciesInfo', species],
      queryFn: () =>
        axios
          .get(`https://pokeapi.co/api/v2/pokemon-species/${species}`)
          .then((res) => res.data),
  })

  useEffect(() => {
    if (data) {
      // automatically select first variety once data loaded
      // TODO, change to on success
      console.log(data)
      setVariety(data.varieties[0].pokemon.name);

    }
  }, [data])

  if (isLoading) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message
  
  return (

    <div className={styles.container}>
      <div  className={styles.varietySelctor}>
        { data && data.varieties.map((varietyData, index) => (
            <label 
              key={index} 
              className={classNames(styles.varietyButton, variety === varietyData.pokemon.name ? styles.selected : "")} 
              onClick={() => setVariety(varietyData.pokemon.name)}
            >{formatName(varietyData.pokemon.name)}</label>
        )) }
      </div>
      <div className={styles.pokemonInfoContainer}>
        <div className={styles.evolutionContainer}>
          <Collapsible title={<p style={{fontWeight: "bold", margin: "0px"}}>Evolutions</p>}>
            <EvolutionInfo evolutionChainURL={data.evolution_chain.url} />
          </Collapsible>
        </div>
        {variety && <VarietyInfo versionGroup={versionGroup} />}
      </div>
    </div>
  )
}
