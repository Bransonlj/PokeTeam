import { useQueries } from '@tanstack/react-query'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import MachineMovesTable from './MachineMovesTable'
import GenericMovesTable from './GenericMovesTable'
import LevelUpMovesTable from './LevelUpMovesTable'
import { useParams } from 'react-router-dom'

// filters move array for move_learn_method matches given method.
const filterMoves = (movesToFilter, method) => movesToFilter.filter(move => move.move_learn_method === method);

export default function MoveList({ moves, type1, type2 }) {

  const { version: versionGroup } = useParams();

  // filters to moves learnable in specified version only.
  const versionMoves = moves.map(move => {
    return {
      ...move, 
      version_group_details: move.version_group_details
          .filter(details => details.version_group.name === versionGroup)
    }
  }).filter(move => move.version_group_details.length > 0)

  // Create array of custome move objects {name, move_learn_method, level_learnt_at}
  // Use flatMap to create multiple entries of moves with multiple learn methods or levels learnt at.
  const cleanedMoves = versionMoves.flatMap(move => {
    return move.version_group_details?.map(detail => {
      return {
        name: move.move.name,
        move_learn_method: detail.move_learn_method.name,
        level_learned_at: detail.level_learned_at,
      }
    })
  });

  const moveQueries = cleanedMoves.map(move => {
    return {
      queryKey: ["move", move.name],
      queryFn: () => 
        axios
          .get(`https://pokeapi.co/api/v2/move/${move.name}`)
          .then(res => res.data),
    }
  })

  const moveQueriesResults = useQueries({ queries: moveQueries})

  const isLoadingMoves = moveQueriesResults.some(r => r.isLoading);

  if (isLoadingMoves) {
    return 'Loading Moves';
  }

  // extract details regarding move.
  const detailedMoves = cleanedMoves.map((move, index) => {
    move.accuracy = moveQueriesResults[index].data.accuracy;
    move.power = moveQueriesResults[index].data.power;
    move.pp = moveQueriesResults[index].data.pp;
    move.type = moveQueriesResults[index].data.type.name;
    move.category = moveQueriesResults[index].data.damage_class.name;
    // due to incomplete data in api, some moves may not have machine data for specific versions(eg. SV)
    move.machineURL = moveQueriesResults[index].data.machines.filter(machine => machine.version_group.name === versionGroup)[0]?.machine.url;
    return move;
  })

  const levelUpMoves = filterMoves(detailedMoves, "level-up");
  const machineMoves = filterMoves(detailedMoves, "machine");
  const tutorMoves = filterMoves(detailedMoves, "tutor");
  const eggMoves = filterMoves(detailedMoves, "egg");
  const formChangeMoves = filterMoves(detailedMoves, "form-change");

  return (
    <div>
      <h2>Level Up Moves</h2>
      <LevelUpMovesTable moves={ levelUpMoves } type1={ type1 } type2={ type2 } />
      <h2>Machine Moves</h2>
      <MachineMovesTable moves={ machineMoves } type1={ type1 } type2={ type2 } />
      <h2>Tutor Moves</h2>
      <GenericMovesTable moves={ tutorMoves } type1={ type1 } type2={ type2 } />
      <h2>Egg Moves</h2>
      <GenericMovesTable moves={ eggMoves } type1={ type1 } type2={ type2 } />
      { formChangeMoves.length > 0 && <h2>Form Change Moves</h2> }
      { formChangeMoves.length > 0 && <GenericMovesTable moves={ formChangeMoves } type1={ type1 } type2={ type2 } />}
    </div>
  )
}
