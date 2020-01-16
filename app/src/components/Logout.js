import React, { useContext, useEffect } from "react";
import { SessionContext } from "../context/SessionContext";
import { Redirect } from "react-router-dom";
import { sessionDestroy } from "../functions/sessionFunctions";

import axios from "axios";
axios.defaults.withCredentials = true;

export const Logout = () => {
    const { dispatch } = useContext(SessionContext);
    
    useEffect(() => {
        
        sessionDestroy(dispatch);
    });

    return (
        <Redirect to={"/"} />
    )
}

export default Logout;