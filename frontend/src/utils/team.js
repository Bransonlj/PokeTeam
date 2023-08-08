
// member code: YYYYZAABBCCDD
const memberHexLength = 13;

/**
 * Checks given object to verify if it is a valid team object to be loaded.
 * @param {*} teamObj 
 */
export async function asyncValidateTeamHex(teamHex, validCallback, invalidCallback = () => {}) {
    if (!teamHex) {
        return false;
    }
    // TODO check length and ID params if valid ID

    const teamQueries = await Promise.all(teamHex.split(",").map(async memberHex => {
        if (memberHex.length !== memberHexLength) {
            return false;
        }
        try {
            const result = await fetch(`https://pokeapi.co/api/v2/pokemon/${hexToNum(memberHex.slice(0, 4))}`)
            const pokemon = await result.json()
            return pokemon.name;
        } catch (error) {
            return false;
        }
    }))

    const isValid = teamQueries.every(x => x);
    if (isValid) {
        validCallback();
    } else {
        invalidCallback();
    }
}


const INVALID_HEX = "f";

// if invalid index, return undefined
function hexToNum(hex) {
    return hex !== INVALID_HEX ? parseInt(hex, 16) : undefined;
}

/**
 * Creates team based on given hexString. hexString is in the format,
 * YYYYZAABBCCDD: where YYYY is the id of the pokemon variety, Z is the ability number,
 * AA - DD are each the index of the move from the learnable moves array.
 * Each team member is seperated by a ','.
 * @param {string} hexString
 * @returns array of member objects {id, abilityIndex, move1Index...move4Index}
 */
export function createTeamFromHex(hexString) {
    if (!hexString) {
        return [];
    }
    return hexString.split(",").map(memberHex => {
        return {
            id: hexToNum(memberHex.slice(0, 4)), // YYYY
            abilityIndex: hexToNum(memberHex.slice(4, 5)), // Z
            move1Index: hexToNum(memberHex.slice(5, 7)), // AA
            move2Index: hexToNum(memberHex.slice(7, 9)), // BB
            move3Index: hexToNum(memberHex.slice(9, 11)), // CC
            move4Index: hexToNum(memberHex.slice(11, 13)), // DD
        }
    })
}


export function teamToHex(team) {

    return team.map(member => {
        return `${member.id.toString(16).padStart(4, '0')}`
                + `${member.abilityIndex?.toString(16) ?? INVALID_HEX}`
                + `${member.move1Index?.toString(16).padStart(2, '0') ?? INVALID_HEX.repeat(2)}`
                + `${member.move2Index?.toString(16).padStart(2, '0') ?? INVALID_HEX.repeat(2)}`
                + `${member.move3Index?.toString(16).padStart(2, '0') ?? INVALID_HEX.repeat(2)}`
                + `${member.move4Index?.toString(16).padStart(2, '0') ?? INVALID_HEX.repeat(2)}`
    }).join(",")
}
