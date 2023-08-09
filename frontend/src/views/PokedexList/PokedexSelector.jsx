import React, { useEffect } from 'react'
import { formatName } from '../../utils/formatters';
import styles from './PokedexSelector.module.scss'
import { useParams } from 'react-router-dom';

export default function PokedexSelector({ selectedPokedex, setSelectedPokedex, pokedexes }) {

    const EXCEPTIONS = [
        {
            version: "brilliant-diamond-and-shining-pearl",
            pokedexes: ["original-sinnoh", "extended-sinnoh"]
            
        }
    ]

    const { version: versionGroup } = useParams();

    // if version group exists in list of exceptions, get list of pokedexes, else get empty array.
    const verifiedPokedexes = pokedexes.length > 0 ? (pokedexes.map(pokedex => pokedex.name)) : (EXCEPTIONS.find((obj) => obj.version === versionGroup)?.pokedexes ?? []);
    
    useEffect(() => {
        // preemptively select the first version pokedex when versionGroup changes
        setSelectedPokedex(verifiedPokedexes[0]);
    }, [versionGroup])

    return (
        <div className={styles.selectorContainer}>
            { verifiedPokedexes.map(pokedex => (
                <label 
                    key={ pokedex } 
                    onClick={ () => setSelectedPokedex(pokedex) }
                    className={selectedPokedex === pokedex ? styles.selected : styles.notSelected}
                >{ formatName(pokedex) }</label>
            )) }
        </div>
  )
}
