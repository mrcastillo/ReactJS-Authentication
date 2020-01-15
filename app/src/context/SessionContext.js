import React, { createContext, useReducer, useEffect } from 'react';
//import { Redirect } from "react-router-dom";
import { sessionReducer } from '../reducers/sessionReducer';
import { sessionStatus } from "../functions/sessionFunctions";
import axios from "axios";
axios.defaults.withCredentials = true;

export const SessionContext = createContext();

const SessionContextProvider = (props) => {
    const [session, dispatch] = useReducer(sessionReducer, {user: ""});

    //When the application loads, perform axios request to server
    useEffect(() => {
        sessionStatus(dispatch);
        console.log("SessionContext Component rendered.");
    }, []);

    return(
        <SessionContext.Provider value={{session, dispatch}}>
            { props.children }
        </SessionContext.Provider>
    )
}

export default SessionContextProvider;