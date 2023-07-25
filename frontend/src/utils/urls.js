const SPRITE_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"

export function getSpriteURL(id) {
    return `${SPRITE_URL}${id}.png`;
}

export function urlToId(url) {
    if (url) {
        const data = url.split("/");
        return data[data.length - 2] //  last entry will be "", so get second last.
    }
}

export function useBaseURL(url) {
    return (import.meta.env.BASE_URL + url);
}