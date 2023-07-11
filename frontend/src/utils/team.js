/**
 * Checks given object to verify if it is a valid team object to be loaded.
 * @param {*} teamObj 
 */
export function isValidTeamHex(teamHex) {
    if (!teamHex) {
        return false;
    }
    return true;

}


const INVALID_INDEX = -1;

// if invalid index, return undefined
function hexToNum(hex) {
    return parseInt(hex, 16) !== INVALID_INDEX ? parseInt(hex, 16) : undefined;
}

/**
 * Creates team based on given hexString. hexString is in the format,
 * xYYxZxAAxBBxCCxDD: where XX is the id of the pokemon variety, Y is the ability number,
 * AA - DD are each the index of the move from the learnable moves array.
 * Each team member is seperated by a ','.
 * @param {string} hexString
 * @returns array of member objects {id, abilityIndex, move1Index...move4Index}
 */
export function createTeamFromHex(hexString) {
    if (!hexString) {
        return;
    }
    return hexString.split(",").map(memberHex => {
        const params = memberHex.split("x")
        return {
            id: parseInt(params[1], 16), // YY
            abilityIndex: hexToNum(params[2]), // Z
            move1Index: hexToNum(params[3]), // AA
            move2Index: hexToNum(params[4]), // BB
            move3Index: hexToNum(params[5]), // CC
            move4Index: hexToNum(params[6]), // DD
        }
    })
}


export function teamToHex(team) {

    return team.map(member => {
        return `x${member.id.toString(16)}`
                + `x${member.abilityIndex?.toString(16) ?? INVALID_INDEX.toString(16)}`
                + `x${member.move1Index?.toString(16) ?? INVALID_INDEX.toString(16)}`
                + `x${member.move2Index?.toString(16) ?? INVALID_INDEX.toString(16)}`
                + `x${member.move3Index?.toString(16) ?? INVALID_INDEX.toString(16)}`
                + `x${member.move4Index?.toString(16) ?? INVALID_INDEX.toString(16)}`
    }).join(",")
}

/**
 * Creates a pokemon member object based on the data fetched from API of 
 * a pokemon variety. Ability and moves are left null.
 * @param {number} id 
 */
export function createMemberFromVarietyData(data) {
    return {
        id: data.id,
        name: data.name, //variety
        species: data.species.name,
        type1: data.types[0].type.name,
        type2: data.types[1]?.type.name,
        ability: "",//defaults to null
        move1: "",
        move2: "",
        move3: "",
        move4: "",
    }
    
}