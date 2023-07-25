import React from 'react'
import { urlToId } from '../../utils/urls'
import { useQuery } from '@tanstack/react-query'

import axios from 'axios'
import { Tree } from '../../classes/Tree'
import EvolutionTree from './EvolutionTree'

function processEvolutionChain(chain) {
    const node = new Tree({
        pokemon: chain.species.name,
        evolution_details: chain.evolution_details // if multiple varieties, will have multiple details
    })

    node.addChildren(chain.evolves_to.map((evolution, index) => {
        return processEvolutionChain(evolution)
    }))

    return node
}

export default function EvolutionInfo({ evolutionChainURL, setSelectedVariety, setSelectedPokemon }) {

    const { isLoading, error, data, isFetching } = useQuery({
        queryKey: ['EvolutionChain', urlToId(evolutionChainURL)],
        queryFn: () =>
            axios
            .get(evolutionChainURL)
            .then((res) => res.data),
    })

    if (isLoading) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message

    const evolutionTree = processEvolutionChain(data.chain)

    return (
        <>
            <EvolutionTree tree={evolutionTree} setSelectedVariety={setSelectedVariety} setSelectedPokemon={setSelectedPokemon} />
        </>
    )
}
