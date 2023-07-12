import { useState } from "react";

export default function useTeam(savedTeam) {
    const [team, setTeam] = useState(savedTeam ? savedTeam : []);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    
    function loadTeam(teamToLoad) {
        // check if valid?
        console.log(teamToLoad)
        setTeam(teamToLoad ? teamToLoad : [])
    }

    function addMember(id) {
        if (team.length > 5) {
            setIsError(true);
            setErrorMessage("Team full, unable to add anymore members");
        } else {
            setIsError(false);
            setErrorMessage("");
            setTeam([...team, {
                id: id,
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

    // member must be a valid object: {id, abilityIndex, move1Index...move4Index}
    // fields other than id may be left undefined.
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
