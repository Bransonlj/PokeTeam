import { useQueries } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react'
import styles from './MovesTable.module.scss'
import { formatName } from '../../utils/formatters';

const sortingFunction = (m1, m2) => {
    // if tm vs hm, sort tm first
    if (m1.charCodeAt(0) !== m2.charCodeAt(0)) {
        return m2.charCodeAt(0) - m1.charCodeAt(0);
    } 

    return m1 > m2 ? 1 : m1 < m2 ? -1 : 0;
}

export default function MachineMovesTable({ moves, versionGroup }) {

    const machineMoveQueries = moves.map(move => {
        return {
          queryKey: ["machine", versionGroup, move.name],
          queryFn: async () => {
            if (move.machineURL) {
                return axios
                    .get(move.machineURL)
                    .then(res => res.data)
            } 
            return "unavailable";
          }

        }
      })
    
    const machineQueriesResults = useQueries({ queries: machineMoveQueries})

    const isLoadingMachines = machineQueriesResults.some(r => r.isLoading);

    if (isLoadingMachines) {
        return 'Loading Machines';
    }

    const detailedMachineMoves = moves
        .map((move, index) => {
            move.machine = machineQueriesResults[index].data.item?.name ?? "??"
            return move;
        }).sort((move1, move2) => sortingFunction(move1.machine, move2.machine));

    return (
    <div className={styles.moveTable}>
        <table>
            <thead>
                <tr>
                    <th>Machine</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Power</th>
                    <th>Accuracy</th>
                    <th>PP</th>
                </tr>
            </thead>
            <tbody>
                { detailedMachineMoves.map((move, index) => (
                    <tr key={ index } >
                        <td>{ move.machine }</td>
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
    </div>
    )
}
