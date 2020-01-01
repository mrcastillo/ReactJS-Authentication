import React from "react";
import { Link } from "react-router-dom";

import ForumRoot from "./ForumRoot";

const Homepage = () => {
    return ( 
        <div className={"homepage"}>
            <h1>Welcome to the forum!</h1>
            <p>Place your discussions here.</p>
            <ul>
                <li>Read Forum Rules</li>
                <li>Sticky Annoucement</li>
                <li><Link to={"/account"}>Account</Link></li>
                <li><Link to={"/forum"}>Forum</Link></li>
            </ul>
        </div>
     );
}
 
export default Homepage;