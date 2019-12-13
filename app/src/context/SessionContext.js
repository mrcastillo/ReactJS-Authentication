import React, { createContext, useReducer, useEffect } from 'react';
//import { Redirect } from "react-router-dom";
import { sessionReducer } from '../reducers/sessionReducer';
import { sessionStatus } from "../functions/sessionFunctions";
import axios from "axios";
axios.defaults.withCredentials = true;

export const SessionContext = createContext();

const SessionContextProvider = (props) => {
    const [session, dispatch] = useReducer(sessionReducer, {
        apiRequestCompleted: false,
        user: ""
    });

    useEffect(() => {
        sessionStatus(dispatch);
        console.log("SessionContext Component rendered.");
    }, []);

    return(
        <SessionContext.Provider value={{session, dispatch}}>
            { session.apiRequestCompleted ? props.children : <div>Loading...</div> }
        </SessionContext.Provider>
    )
}

export default SessionContextProvider;