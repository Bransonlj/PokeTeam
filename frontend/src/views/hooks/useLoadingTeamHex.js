import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { isValidTeamHex } from "../../utils/team";

export default function useLoadingTeamHex() {
    const [searchParams, setSearchParams] = useSearchParams();

    // determine whether to load team from hex or load and save from local storage.
    const [isLoadFromHex, setIsLoadFromHex] = useState(false);

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

    useEffect(() => {
        setTeamHex(searchParams.get("team"));
    }, [searchParams])

    // in a seperate useEffect because teamHex can change independently of searchparams.
    useEffect(() => {
        if (isValidTeamHex(teamHex)) {
            setIsLoadFromHex(true);
        } else {
            setIsLoadFromHex(false);
        }
    }, [teamHex])

    return { teamHex, setTeamHex, isLoadFromHex, clearLoadedTeam }
}
