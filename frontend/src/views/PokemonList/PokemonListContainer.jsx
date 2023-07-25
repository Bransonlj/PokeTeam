import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FixedSizeList } from 'react-window'
import styles from './PokemonListContainer.module.scss'
import classNames from 'classnames'
import { formatName } from '../../utils/formatters'

export default function PokemonListContainer({ pokedex, setSelectedPokemon }) {
    const [searchFilter, setSearchFilter] = useState("");
    const [pokemonList, setPokemonList] = useState();

    const { isLoading, error, data, isFetching } = useQuery({
        queryKey: ['PokemonList', pokedex],
        queryFn: () =>
          axios
            .get(`https://pokeapi.co/api/v2/pokedex/${pokedex}`)
            .then((res) => {
                setPokemonList(res.data.pokemon_entries);
                return res.data
            }),
    })

    // update pokemon list when searchFilter is updated
    useEffect(() => {
        if (data) {
            setPokemonList(data.pokemon_entries.filter(entry => {
                return entry.pokemon_species.name.toLowerCase().includes(searchFilter.toLowerCase())
            }))
        }
    }, [searchFilter])

    // reset search filter when switching pokedex
    useEffect(() => {
        setSearchFilter("")
    }, [pokedex])

    const PokemonRow = ({ index, style }) => {
        if (pokemonList.length === 0) {
            return (
                <label style={style}>No Pokemon Found</label>
            )
        }

        const name = pokemonList[index].pokemon_species.name;
        return (
            <label className={classNames(styles.row, styles[index % 2 === 0 ? 'evenRow' : 'oddRow'])} style={style} onClick={() => setSelectedPokemon(name)}>{formatName(name)}</label>
        )
    }

    if (isLoading) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message

    return (
        <div className={styles.container}>
            <div className={styles.searchContainer}>
            <label>Search</label>
            <input 
                onChange={(e) => {setSearchFilter(e.target.value)}}
                value={searchFilter}/>
            </div>
            {pokemonList &&
                <FixedSizeList
                className={styles.List}
                    height={80}
                    itemCount={pokemonList.length === 0 ? 1 : pokemonList.length}
                    itemSize={16}
                    width={200}>
                    {PokemonRow}
                </FixedSizeList>
            }

        </div>
    )
}
