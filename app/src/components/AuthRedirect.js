import React, { useContext, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { sessionStatus } from "../functions/sessionFunctions";
import { SessionContext }  from "../context/SessionContext";
//import axios from "axios";

const AuthRedirect = (props) => {
    const {session, dispatch} = useContext(SessionContext);

    useEffect(() =>  {
        sessionStatus(dispatch);
        console.log("useEffect completed on AuthRedirect", session);
    }, []);

    const renderContent = () => {
        if(props.hideOnLogin) {
            return (
                session.user.length > 0 ? <Redirect to={"/"} /> : props.children
            )
        }
        else {
            return (
                session.user.length > 0 ? props.children : <Redirect to={"/"} />
            )
        }
    };

    return (
        renderContent()
    )
}

export default AuthRedirect;