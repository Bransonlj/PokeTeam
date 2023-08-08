import { useContext } from "react"
import { PokemonContext } from "../../context/PokemonContext"

export const usePokemonContext = () => {
    const context = useContext(PokemonContext)
    if (!context) {
        throw Error("usePokemonContext must be used inside PokemonContextProdiver");
    }

    const {species, variety, dispatch} = context;

    function setSpecies(species) {
        dispatch({
            type: "SET_SPECIES",
            payload: {
                species: species,
            }
        });
    }

    function setVariety(variety) {
        dispatch({
            type: "SET_VARIETY",
            payload: {
                variety: variety,
            }
        });
    }

    return { species, variety, setSpecies, setVariety }

}