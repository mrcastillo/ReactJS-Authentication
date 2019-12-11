import React from "react";
import { Link } from "react-router-dom";

const Homepage = () => {
    return ( 
        <div className={"homepage"}>
            <h1>Welcome to the forum!</h1>
            <p>Place your discussions here.</p>
            <ul>
                <li>Read Forum Rules</li>
                <li>Sticky Annoucement</li>
                <li><Link to={"/account"}>Account</Link></li>
            </ul>

            <div className={"forum"}>
                <table>
                    <thead>
                        <tr>
                            <td>Poster</td>
                            <td>Subject</td>
                            <td>Views</td>
                            <td>Replies</td>
                            <td>Last Reply</td>
                            <td>Created</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Caroline</td>
                            <td><Link to={"/"}>My new song</Link></td>
                            <td>110</td>
                            <td>25</td>
                            <td>December 10, 2019 12:21:00</td>
                            <td>December 10, 2019 06:00:00</td>
                        </tr>
                        <tr>
                            <td>Kraghbin</td>
                            <td><Link to={"/"}>The Texas Sun</Link></td>
                            <td>250</td>
                            <td>75</td>
                            <td>December 10, 2019 11:24:44</td>
                            <td>December 05, 2019 06:00:00</td>
                        </tr>
                        <tr>
                            <td>Kurt Nirvana</td>
                            <td><Link to={"/"}>Smells like something here</Link></td>
                            <td>500</td>
                            <td>112</td>
                            <td>December 10, 2019 14:45:11</td>
                            <td>November 02, 2019 12:00:00</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        
        </div>
     );
}
 
export default Homepage;