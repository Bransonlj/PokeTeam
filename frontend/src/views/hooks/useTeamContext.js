import { useContext } from "react"
import { TeamContext } from "../../context/TeamContext"

export const useTeamContext = () => {
    const context = useContext(TeamContext)
    
    if (!context) {
        throw Error("useTeamContext must be used inside TeamContextProdiver");
    }

    const {team, dispatch} = context;

    /**
     * Sets team in TeamContext to given team.
     * @param {*} team Array of members.
     */
    function setTeam(team) {
        console.log(team)
        dispatch({
            type: "SET_TEAM",
            payload: {
                team: team
            }
        })
    }

    function addMember(pokemonID) {
        const newMember = {
            id: pokemonID,
            abilityIndex: undefined,
            move1Index: undefined,
            move2Index: undefined,
            move3Index: undefined,
            move4Index: undefined,
        }
        dispatch({
            type: "ADD_MEMBER",
            payload: {
                member: newMember,
            }
        })
    }

    function updateMember(field, value, index) {
        const member = team[index];
        member[field] = value;
        dispatch({
            type: "UPDATE_MEMBER",
            payload: {
                member: member,
                index: index,
            }
        })
    }

    function deleteMember(index) {
        dispatch({
            type: "DELETE_MEMBER",
            payload: {
                index: index
            }
        })
    }

    return { team, setTeam, addMember, updateMember, deleteMember };
}