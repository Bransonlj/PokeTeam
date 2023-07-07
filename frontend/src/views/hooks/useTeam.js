import { useState } from "react";

export default function useTeam(savedTeam) {
    const [team, setTeam] = useState(savedTeam ? savedTeam : []);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    function loadTeam(teamToLoad) {
        setTeam(teamToLoad ? teamToLoad : [])
    }

    function addMember(id, pokemon, species, ...types) {
        if (team.length > 5) {
            setIsError(true);
            setErrorMessage("Team full, unable to add anymore members");
        } else {
            setIsError(false);
            setErrorMessage("");
            setTeam([...team, {
                id: id,
                name: pokemon,
                species: species,
                type1: types[0],
                type2: types[1] ?? "",
                ability: "",//defaults to null
                move1: "",
                move2: "",
                move3: "",
                move4: "",
            }]);
        }
    }

    function deleteMember(index) {
        if (team[index] === undefined) {
            setIsError(true);
            setErrorMessage("no member at index");
        } else {
            setIsError(false);
            setErrorMessage("");
            setTeam(team.filter((x, i) => i !== index));
        }
    }

    function updateMember(newMember, index) {
        if (team[index] === undefined) {
            setIsError(true);
            setErrorMessage("no member at index");
        } else {
            setIsError(false);
            setErrorMessage("");
            setTeam(team.map((oldMember, i) => i === index ? newMember : oldMember))
        }
    }

    return {team, isError, errorMessage, addMember, deleteMember, updateMember, loadTeam};
}
