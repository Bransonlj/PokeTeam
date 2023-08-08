import { createContext, useReducer } from "react";

export const PokemonContext = createContext();

export const pokemonReducer = (state, action) => {
    switch (action.type) {
        case "SET_SPECIES":
            return {
                ...state,
                species: action.payload.species,
            }
        case "SET_VARIETY":
            return {
                ...state,
                variety: action.payload.variety,
            }
        default:
            return state;
    }
}

export function PokemonContextProvider({ children }) {
    const [state, dispatch] = useReducer(pokemonReducer, {
        species: "",
        variety: ""
    })

    return (
        <PokemonContext.Provider value={{...state, dispatch}}>
            { children }
        </PokemonContext.Provider>
    )
}