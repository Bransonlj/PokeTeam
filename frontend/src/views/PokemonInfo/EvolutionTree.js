import React from 'react'
import styles from './EvolutionTree.module.scss'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getSpriteURL, urlToId } from '../../utils/urls';
import { formatEvolutionDetails, isStandardVariety } from '../../utils/formatters';

export default function EvolutionTree({ tree, setSelectedVariety, setSelectedPokemon }) {

    const pokemon = tree.value.pokemon;

    const { isLoading, error, data, isFetching } = useQuery({
        queryKey: ['PokemonSpeciesInfo', pokemon],
        queryFn: () =>
          axios
            .get(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}`)
            .then((res) => res.data),
    })

    if (isLoading) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message
    
    const evolutionVarieties = data.varieties.filter(variety => isStandardVariety(variety.pokemon.name));

    return (
        <div className={styles.evolutionTreeContainer}>

            <div>
                {evolutionVarieties.map((variety, index) => (
                    <div key={index} className={styles.evolutionCard}>
                        <div className={styles.evolutionMethod}>
                            {tree.value.evolution_details.map((detail, index) => (
                                <p key={index}>{formatEvolutionDetails(detail)}</p>
                            ))}
                        </div>
                        <img 
                            src={getSpriteURL(urlToId(variety.pokemon.url))} 
                            onClick={() => {setSelectedVariety(variety.pokemon.name); setSelectedPokemon(pokemon);}}
                        />
                    </div>
                )) }
            </div>

            <div>
            { tree.hasChildren() && tree.getChildren().map((child, index) => (
                <EvolutionTree key={index} tree={child} setSelectedVariety={setSelectedVariety} setSelectedPokemon={setSelectedPokemon}/>
            )) }
            </div>
        </div>
    )
}
