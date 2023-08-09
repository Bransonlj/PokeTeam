import styles from './MovesTable.module.scss'
import { formatName } from '../../utils/formatters';
import ThemedBox from '../components/ThemedBox';

export default function  LevelUpMovesTable({ moves, type1, type2 }) {

    const levelUpMoves = moves
            .sort((m1, m2) => m1.level_learned_at > m2.level_learned_at ? 1 : m1.level_learned_at < m2.level_learned_at ? -1 : 0)
            .map(move => {
                if (move.level_learned_at === 0) {
                    move.level_learned_at = "evo";
                }
                return move;
            });

    return (
        <ThemedBox type1={type1} type2={type2}>
            <table>
                <thead>
                    <tr>
                        <th>Level</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Category</th>
                        <th>Power</th>
                        <th>Accuracy</th>
                        <th>PP</th>
                    </tr>
                </thead>
                <tbody>
                    { levelUpMoves.map((move, index) => (
                        <tr key={ index } >
                            <td>{ move.level_learned_at }</td>
                            <td>{ formatName(move.name) }</td>
                            <td className={ styles[`type-${move.type}`] } >{ move.type }</td>
                            <td>{ move.category }</td>
                            <td>{ move.power ? move.power : "---" }</td>
                            <td>{ move.accuracy ? move.accuracy : "---" }</td>
                            <td>{ move.pp }</td>
                        </tr>
                    )) }
                </tbody>
            </table>
        </ThemedBox>
    )
  }
