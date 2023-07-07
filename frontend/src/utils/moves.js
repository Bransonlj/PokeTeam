
// filters to moves learnable in specified version only.
export function filterByVersion(moves, version) {
    return moves.map(move => {
        return {
          ...move, 
          version_group_details: move.version_group_details
              .filter(details => details.version_group.name === version)
        }
      }).filter(move => move.version_group_details.length > 0)
}


export function cleanUpMoves(moves) {
    return moves.flatMap(move => {
        return move.version_group_details?.map(detail => {
          return {
                name: move.move.name,
                move_learn_method: detail.move_learn_method.name,
                level_learned_at: detail.level_learned_at,
          }
        })
    });
}
