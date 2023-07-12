import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// variety can be either name or id
export default function useFetchVariety(variety) {
    const { isLoading, error, isError, data } = useQuery({
        queryKey: ['PokemonVarietyInfo', variety],
        queryFn: () =>
            axios
                .get(`https://pokeapi.co/api/v2/pokemon/${variety}`)
                .then((res) => res.data),
        refetchOnWindowFocus: false,
    })

    return {isLoading, error, isError, data}
}
