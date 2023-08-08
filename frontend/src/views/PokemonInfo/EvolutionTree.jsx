import React from 'react'
import styles from './EvolutionTree.module.scss'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getSpriteURL, urlToId } from '../../utils/urls';
import { formatEvolutionDetails, isStandardVariety } from '../../utils/formatters';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { usePokemonContext } from '../hooks/usePokemonContext';

const METHOD_WARNING_STRING = "Evolution methods for different varieties (i.e. Kantonian/Alolan Sandslash) are grouped together."

export default function EvolutionTree({ tree }) {

    const pokemon = tree.value.pokemon;

    const { setSpecies, setVariety } = usePokemonContext();

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
            <div className={styles.evolutionCard}>
                <div className={styles.evolutionMethod}>
                    { evolutionVarieties.length > 1 ? tree.value.evolution_details.map((detail, index) => (
                            <Tippy key={index} content={METHOD_WARNING_STRING}>
                                <label>{formatEvolutionDetails(detail)}</label>
                            </Tippy>
                            )) : tree.value.evolution_details.map((detail, index) => (
                                <label key={index}>{formatEvolutionDetails(detail)}</label>
                            ))
                        
                    }
                </div>
                <div className={styles.varietiesContainer}>
                    {evolutionVarieties.map((variety, index) => (
                            <img 
                                key={index}
                                className={styles.sprite}
                                src={getSpriteURL(urlToId(variety.pokemon.url))} 
                                onClick={() => {setVariety(variety.pokemon.name); setSpecies(pokemon);}}
                            />
                    )) }
                </div>
            </div>
            <div className={styles.childrenEvolutionTreeContainer}>
            { tree.hasChildren() && tree.getChildren().map((child, index) => (
                <EvolutionTree key={index} tree={child}/>
            )) }
            </div>
        </div>
    )
}
