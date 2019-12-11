import React, { useContext, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { SessionContext }  from "../context/SessionContext";
//import axios from "axios";

const AuthRedirect = (props) => {
    const {session} = useContext(SessionContext);
    
    useEffect(() =>  {
        console.log("useEffect completed on AuthRedirect", session);
    }, []);

    const renderContent = () => {
    }
    return (
        session.user.length > 0 ? 
            props.children : <Redirect to={"/"} />
    )
}

export default AuthRedirect;