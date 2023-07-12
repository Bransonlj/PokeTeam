import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { asyncValidateTeamHex } from "../../utils/team";

export default function useLoadingTeamHex() {
    const [searchParams, setSearchParams] = useSearchParams();

    // determine whether to load team from hex or load and save from local storage.
    const [isLoadFromHex, setIsLoadFromHex] = useState(false);
    const [isError, setIsError] = useState(false);

    // for use to communicate teamHex with TeamBuilder Component.
    const [teamHex, setTeamHex] = useState("");

    const clearLoadedTeam = () => {
        if (searchParams.has("team")) {
            searchParams.delete("team");
            setSearchParams(searchParams);
            // changing search params will trigger useEffect to clear teamHex
        } else {
            setTeamHex("");
        }
    }

    const clearError = () => {
        setIsError(false);
    }

    useEffect(() => {
        setTeamHex(searchParams.get("team"));
    }, [searchParams])

    // in a seperate useEffect because teamHex can change independently of searchparams.
    useEffect(() => {
        if (!teamHex) {
            // if teamHex is undefined, no need to validate as no code was given.
            setIsLoadFromHex(false)
        } else {
            asyncValidateTeamHex(teamHex, 
                () => {
                    setIsLoadFromHex(true)
                    clearError()
                }, 
                () => {
                    setIsLoadFromHex(false)
                    setIsError(true)
                    clearLoadedTeam()
                }
            )
        }
    }, [teamHex])

    return { teamHex, setTeamHex, isLoadFromHex, clearLoadedTeam, isError, clearError }
}
