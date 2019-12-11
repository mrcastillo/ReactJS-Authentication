import React, { useContext } from "react";
import { SessionContext } from  "../context/SessionContext";
import { Redirect } from "react-router-dom";
import { fakeSession } from "../functions/sessionFunctions";
import axios from "axios";
axios.defaults.withCredentials = true;

const TestLogin = () => {
    const {session, dispatch} = useContext(SessionContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        fakeSession(dispatch);
        console.log("Logged In");
    }
    return ( 
        <div className={"login"}>
            <h1>Login to your account.</h1>

            <div>
                <form onSubmit={handleSubmit}>
                    <input type={"submit"} value={"Login"}/>
                </form>
            </div>

            <div>Logged in? {session.user}</div>
        </div>
     );
}
 
export default TestLogin;