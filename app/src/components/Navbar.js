import React, { useEffect, useContext } from "react";
import { SessionContext } from "../context/SessionContext";
import { Link } from "react-router-dom";

const Navbar = () => {

    const { session } = useContext(SessionContext);

    useEffect(() => {
        //console.log("Checking navbar session, it is currently: ", session);
    }, []);
    

    const LoggedInLinks = () => {
        return(
            <div><Link to={"/logout"}>Logout</Link></div>
        );
    };

    const LoggedOutLinks = () => {
        return (
            <React.Fragment>
                <div><Link to={"/login"}>Login</Link></div>
                <div><Link to={"/signup"}>Sign Up</Link></div>
            </React.Fragment>
        )
    }
    return ( 
        <div className={"navbar"}>
            <div className={"brand"}>
                <h1><Link to={"/"}>General Forum</Link></h1>
            </div>
            <div className={"nav-options"}>
                { session.user.length > 0 ? <LoggedInLinks /> : <LoggedOutLinks />}
            </div>
        </div>
     );
}
 
export default Navbar;