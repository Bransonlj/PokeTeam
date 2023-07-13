import { urlToId } from "./urls"

const GENERIC_MATCHUP = {
    normal: 1,
    fighting: 1,
    flying: 1,
    poison: 1, 
    ground: 1, 
    rock: 1,
    bug: 1,
    ghost: 1,
    steel: 1,
    fire: 1,
    water: 1,
    grass: 1,
    electric: 1,
    psychic: 1,
    ice: 1,
    dragon: 1,
    dark: 1,
    fairy: 1,
}

// get object with all types at value 0, but filter out some types based on generation.
export function getGenericMatchup(generation) {
    const clonedMatchup = structuredClone(GENERIC_MATCHUP);
    if (generation < 2) {
        delete clonedMatchup.dark;
        delete clonedMatchup.steel;
    }
    if (generation < 6) {
        delete clonedMatchup.fairy;
    }

    return clonedMatchup;
}

// based on the generation, check for past damage relations and determine which to use.
export function getRelationToUse(type, generation) {
    if (!type) {
        return;
    }

    const pastRelations = type.past_damage_relations.map(relation => {
        return {
            ...relation,
            generation: urlToId(relation.generation.url)
        }
    }).sort((r1, r2) => r1.generation > r2.generation ? 1 : 0) // generations will not be equal.

    // get the first relation after filtering for relations equal or after given generation.
    const pastRelation = pastRelations.filter(relation => relation.generation >= generation)[0]

    // if past relation exists, use it, else use current relation.
    if (pastRelation) {
        return pastRelation.damage_relations;
    }

    return type.damage_relations;
}

export function getAllTypesDefensiveDamageRelation(damageRelations, generation) {
    if (!damageRelations) {
        return;
    }

    const matchups = getGenericMatchup(generation)
    damageRelations.double_damage_from.map(type => matchups[type.name] *= 2);
    damageRelations.half_damage_from.map(type => matchups[type.name] *= 0.5);
    damageRelations.no_damage_from.map(type => matchups[type.name] *= 0);
    return matchups;
}

export function getAllTypesOffensiveDamageRelation(damageRelations, generation) {
    if (!damageRelations) {
        return;
    }

    const matchups = getGenericMatchup(generation)
    damageRelations.double_damage_to.map(type => matchups[type.name] *= 2);
    damageRelations.half_damage_to.map(type => matchups[type.name] *= 0.5);
    damageRelations.no_damage_to.map(type => matchups[type.name] *= 0);
    return matchups;
}

export function calculateDefensiveRelations(generation, type1, type2=null) { 
    const type1Relations = getRelationToUse(type1, generation);
    const type2Relations = getRelationToUse(type2, generation);

    const type1Matchups = getAllTypesDefensiveDamageRelation(type1Relations, generation);
    const type2Matchups = getAllTypesDefensiveDamageRelation(type2Relations, generation);

    if (type2) {
        Object.keys(type1Matchups).map(type => {
            type1Matchups[type] *= type2Matchups[type];
        })
    }

    return type1Matchups;
}


export function calculateOffensiveRelations(generation, type1, type2=null) { 
    const type1Relations = getRelationToUse(type1, generation);
    const type2Relations = getRelationToUse(type2, generation);

    const type1Matchups = getAllTypesOffensiveDamageRelation(type1Relations, generation);
    const type2Matchups = getAllTypesOffensiveDamageRelation(type2Relations, generation);
    // for offensive relation, we are more optimistic. For pokemon with 2 types, we take only the better matchup (higher value)
    if (type2) {

        Object.keys(type1Matchups).map(type => {
                if (type1Matchups[type] < type2Matchups[type]) {
                    type1Matchups[type] = type2Matchups[type];
                }
                // inplace modification of type1Matchups object, no return value.
            }
        )
    }

    return type1Matchups;
}
