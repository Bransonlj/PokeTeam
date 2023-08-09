import PokedexSelector from "./PokedexSelector";
import PokemonListContainer from "./PokemonListContainer";
import styles from './PokedexListContainer.module.scss';
import { useState } from "react";

export default function PokedexListContainer({ pokedexes }) {

    const [selectedPokedex, setSelectedPokedex] = useState("");

    return (
        <div className={styles.mainContainer}>
            <PokedexSelector 
                selectedPokedex={selectedPokedex} 
                setSelectedPokedex={setSelectedPokedex} 
                pokedexes={pokedexes}
            />
            { selectedPokedex && 
                <PokemonListContainer 
                    pokedex={ selectedPokedex } /> }
        </div>
    )
}