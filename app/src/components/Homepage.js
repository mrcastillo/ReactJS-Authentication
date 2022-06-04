import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { SessionContext } from "../context/SessionContext";

import ForumRoot from "./ForumRoot";

import mushroom from "../images/mushroom.png";
import castle from "../images/castle.png";
import pipe from "../images/pipe.png";

const Homepage = () => {
    const { session } = useContext(SessionContext);

    useEffect(() => {
        //console.log("Checking navbar session, it is currently: ", session);
    }, []);

    return ( 
        <div className={"homepage"}>
            <h1 id={"homepage-welcome"}>Welcome to Gamers Lounge!</h1>
            <p>Place your discussions here.</p>

            <ul>
                <li>Read Forum Rules - <span>Forum Rules</span></li>
                <li>
                    Accounts can be removed at any moment.
                </li>
            </ul>

            <div className={"action-select"}>
                <Link to={"/forum"} id={"site-button-1"}>
                    <img src={mushroom} width={50} height={50}></img>
                    <p>Enter Forum</p>
                </Link>

                { session.user.length > 0 ? (null) : (<Link to={"/login"} id={"site-button-1"}>
                    <img src={pipe} width={50} height={50}></img>
                    <p>Account Login</p>
                </Link>)}

                { session.user.length > 0 ? (null) : (<Link to={"/signup"} id={"site-button-1"}>
                    <img src={castle} width={50} height={50}></img>
                    <p>Create Account</p>
                </Link>)}
                
            </div>

            <div className={"homepage-news"}>
                
                <h1>News</h1>
                <p id={"homepage-news-date"}>Date May 3rd, 2021</p>
                
                <p id={"homepage-news-subject"}>We released some new updates to the website. The biggest improvement to the Front End/UI since the app was created.</p>
                <ul>
                    <li>Updated UI and website is no longer basic.</li>
                    <li>Found a bug where forum wont load if a deleted user posted.</li>
                    <li>Added new admin features to website.</li>
                </ul>

                <hr/>
            </div>
        </div>
     );
}
 
export default Homepage;