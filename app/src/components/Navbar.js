import React, { useEffect, useContext } from "react";
import { SessionContext } from "../context/SessionContext";
import { Link } from "react-router-dom";

import mushroom from "../images/mushroom.png";

const Navbar = () => {

    const { session } = useContext(SessionContext);

    useEffect(() => {
        //console.log("Checking navbar session, it is currently: ", session);
    }, []);
    

    const LoggedInLinks = () => {
        return(
            <React.Fragment>
                <div><Link to={"/account"}>Account</Link></div>
                <div><Link to={"/logout"}>Logout</Link></div>
            </React.Fragment>
            
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
                <img src={mushroom} width={20} height={20}/>
                <h3><Link to={"/"}>Gamer Lounge</Link></h3>
            </div>
            <div className={"nav-options"}>
                { session.user.length > 0 ? <LoggedInLinks /> : <LoggedOutLinks />}
            </div>
        </div>
     );
}
 
export default Navbar;