import { createContext, useReducer } from 'react';

export const TeamContext = createContext();

const teamReducer = (state, action) => {
    switch (action.type) {
        case "SET_TEAM":
            return {
                team: action.payload.team
            }
        case "ADD_MEMBER":
            return {      
                team: [...state.team, action.payload.member]
            };
        case "UPDATE_MEMBER":
            return {
                team: state.team.map((teamMember, index) => index === action.payload.index ? action.payload.member : teamMember)
            }
        case "DELETE_MEMBER":
            return {
                team: state.team.filter((teamMember, index) => index !== action.payload.index)
            }
        default:
            return state;
    }
}

export const TeamContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(teamReducer, {
        team: [],
    });

    return (
        <TeamContext.Provider value={{...state, dispatch}}>
            {children}
        </TeamContext.Provider>
    )
}