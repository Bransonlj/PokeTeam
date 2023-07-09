/**
 * Returns whether a variety name is a mega-evolution based on
 * if it ends with '-mega';
 * @param {string} variety 
 * @returns {boolean} standard?
 */
export function isStandardVariety(variety) {
    return !(variety.endsWith('-mega') 
            || variety.endsWith('-gmax')
            || variety.endsWith('-starter'));
}

export function getGenderFromId(id) {
    switch (id) {
        case 0:
            return "female";
        case 1:
            return "male";
        case 2:
            return "genderless";
        default:
            throw new Error("invalid ID")
    }
}

const EvolutionDetailFields = {
    ITEM: "item",
    GENDER: "gender",
    HELD_ITEM: "held_item",
    KNOWN_MOVE: "known_move",
    KNOWN_MOVE_TYPE: "known_move_type",
    LOCATION: "location",
    MIN_LEVEL: "min_level",
    MIN_HAPPINESS: "min_happiness",
    MIN_BEAUTY: "min_beauty",
    MIN_AFFECTION: "min_affection",
    NEEDS_OVERWORLD_RAIN: "needs_overworld_rain",
    PARTY_SPECIES: "party_species",
    PARTY_TYPE: "party_type",
    RELATIVE_PHYSICAL_STATS: "relative_physical_stats",
    TIME_OF_DAY: "time_of_day",
    TRADE_SPECIES: "trade_species",
    TURN_UPSIDE_DOWN: "turn_upside_down",
}

export function formatEvolutionDetails(detail) {
    
    const requirements = Object.keys(detail)
        // filter out empty details and trigger.
        .filter(method => detail[method] && method !== "trigger")
        .map(method => {
            switch (method) {
                case EvolutionDetailFields.ITEM: // item object
                    return formatName(detail[method].name);

                case EvolutionDetailFields.GENDER: // integer
                    return getGenderFromId(detail[method]);

                case EvolutionDetailFields.HELD_ITEM: // item object
                    return detail[method].name;

                case EvolutionDetailFields.KNOWN_MOVE: // move object
                    return detail[method].name;

                case EvolutionDetailFields.KNOWN_MOVE_TYPE: // type object
                    return `knowing ${formatName(detail[method].name)} Type move`;

                case EvolutionDetailFields.LOCATION: // location object
                    return `at ${formatName(detail[method].name)}`;

                case EvolutionDetailFields.MIN_LEVEL: // integer
                    return detail[method];

                case EvolutionDetailFields.MIN_HAPPINESS: // integer
                    return `min happiness: ${detail[method]}`;

                case EvolutionDetailFields.MIN_BEAUTY: // integer
                    return `min beauty: ${detail[method]}`;

                case EvolutionDetailFields.MIN_AFFECTION: // integer
                    return `min affection: ${detail[method]}`;

                case EvolutionDetailFields.NEEDS_OVERWORLD_RAIN: // boolean
                    return detail[method] ? "while raining" : "";   

                case EvolutionDetailFields.PARTY_SPECIES: // pokemonSpecies object
                    return "in party:" + detail[method].name;

                case EvolutionDetailFields.PARTY_TYPE: // type object
                    return "in party:" + detail[method].name;

                case EvolutionDetailFields.RELATIVE_PHYSICAL_STATS: // integer
                    return detail[method];

                case EvolutionDetailFields.TIME_OF_DAY: // string(day or night)
                    return detail[method];

                case EvolutionDetailFields.TRADE_SPECIES: // pokemonSpecies object
                    return "trade with:" + detail[method].name;

                case EvolutionDetailFields.TURN_UPSIDE_DOWN: // boolean
                    return detail[method] ? "turn upside down" : "";
                    
                default:
                    return "unknown method"
            }

            
    }) 
    return formatName(detail.trigger.name) + " " + requirements.join(" & ");
}

/**
 * Formats given string by removing '-' and capitalizing first character of each word.
 * @param {String} str 
 * @returns {String} formatted string.
 */
export function formatName(str) {
    return str.split("-")
            .map(word =>
                    word.charAt(0).toUpperCase() + word.substring(1))
            .join(" ");
}