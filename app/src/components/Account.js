import React, { useContext } from "react";
import { SessionContext } from "../context/SessionContext";
import { useRouteMatch, Link } from "react-router-dom";

const Account = () => { 
    const { path } = useRouteMatch();

    const { session, dispatch } = useContext(SessionContext);

    return ( 
        <div className={"account"}>
            <h1>Account Settings</h1>
            <p>Change your profile settings here.</p>
            <hr/>

            <h1>Account Info</h1>
            <h4>Created: December 10, 2019</h4>
            <h4>Email: {session.user}</h4>

            <div>
                <h1>Change Password</h1>
                <Link to={`${path}/passwordsettings`}>Change Password</Link>
                <h1>Delete Account</h1>
                <p>Delete my Account</p>
            </div>
        </div>
     );
}
 
export default Account;