import React from 'react'
import styles from './MovesTable.module.scss'
import { formatName } from '../../utils/formatters'
import ThemedBox from '../components/ThemedBox'

export default function GenericMovesTable({ moves, type1, type2 }) {
    return (
        <ThemedBox type1={type1} type2={type2}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Category</th>
                <th>Power</th>
                <th>Accuracy</th>
                <th>PP</th>
              </tr>
            </thead>
            <tbody>
              { moves.map((move, index) => (
                <tr key={ index } >
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
