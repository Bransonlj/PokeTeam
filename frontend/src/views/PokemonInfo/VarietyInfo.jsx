import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import MoveList from './MoveList';
import Abilities from './Abilities';
import Stats from './Stats';
import Location from './Location';
import { getSpriteURL } from '../../utils/urls';
import styles from'./VarietyInfo.module.scss';
import classNames from 'classnames';
import ThemedBox from '../components/ThemedBox';
import { formatName } from '../../utils/formatters';
import { useTeamContext } from '../hooks/useTeamContext';
import { usePokemonContext } from '../hooks/usePokemonContext';

export default function VarietyInfo() {

    const { addMember } = useTeamContext();
    const { variety } = usePokemonContext();

    const { isLoading, error, data, isFetching } = useQuery({
        queryKey: ['PokemonVarietyInfo', variety],
        queryFn: () =>
            axios
                .get(`https://pokeapi.co/api/v2/pokemon/${variety}`)
                .then((res) => res.data),
    })

    if (isLoading) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message
    
    // the name of the types of this variety in an array. Eg. [fire, water]
    const simpleTypes = data.types.map(type => type.type.name);


    return (
        <div className={styles.infoContainer}>
            <ThemedBox type1={simpleTypes[0]} type2={simpleTypes[1]} >
                <div className={styles.summaryCard}>
                    <div className={classNames(styles.spriteCard, styles[`type1-${simpleTypes[0]}`], styles[`type2-${simpleTypes[1]}`])}>
                        <img className={styles.sprite} src={ getSpriteURL(data.id) } />
                        <div className={styles.typeContainer}>
                            { data.types.map(type => (
                                <span key={ type.slot } className={classNames(styles.type, styles[type.type.name])}> { formatName(type.type.name) }</span>
                            )) }
                        </div>
                        <Abilities abilities={data.abilities} />
                    </div>
                    <div className={classNames(styles.rightSide, styles[`type1-${simpleTypes[0]}`], styles[`type2-${simpleTypes[1]}`])}>
                        <button type="button" onClick={() => addMember(data.id)}>add to team</button>
                        <Stats stats={data.stats} types={simpleTypes} />
                    </div>
                        
                </div>
            </ThemedBox>
            <Location encounterURL={data.location_area_encounters} types={simpleTypes} />
            <MoveList moves={data.moves} type1={simpleTypes[0]} type2={simpleTypes[1]}/>
        </div>
    )
}
