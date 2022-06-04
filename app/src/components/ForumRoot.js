import React, { useState } from "react";
import { Link, Route } from "react-router-dom";
import _ from "lodash";

import bullet from "../images/bullet.png";
import coin from "../images/coin.png";

const ForumRoot = (props) => {
    console.log("forum root", props);
    
    function ForumCategories() {
        const URL = props.match.path;
        const category = props.categories;
        const categoryElements = [];

        if(category.length > 0) {
            _.forEach(category, (category, key) => {
                var categoryURL = category.subject.replace(/\s+/g, '');
                categoryURL = categoryURL.toLowerCase();

                categoryElements.push(
                    <React.Fragment key={key}>
                        <div className={"forum-category-body-row"}>
                            <div className={"forum-category-body-row-box"}><p><Link to={`${URL}/${categoryURL}`}>{category.subject}</Link></p></div>
                            <div className={"forum-category-body-row-box"}><p>{category.description}</p></div>
                            <div className={"forum-category-body-row-box"}><p>{category.threads}</p></div>
                            <div className={"forum-category-body-row-box"}><p>{category.posts}</p></div>
                        </div>
                    </React.Fragment>
                )
            });
        }
        
        return (
            <React.Fragment>
                {categoryElements}
            </React.Fragment>
        )
    }
    
    return (
        <div className={"forum"}>
            <h1 id={"forum-h1"}>Gamer's Lounge Forum</h1>
            <p id={"forum-p"}>Welcome to the Gamers Lounge forums. Select a category to join the discussion.</p>

            <ul>
                <li>Read Forum Rules - <span>Forum Rules</span></li>
                <li>
                    Accounts can be removed at any moment.
                </li>
            </ul>

            <div className={"action-select"}>
                <Link to={"/"} id={"site-button-2"}>
                    <img src={bullet} width={35} height={25}/>
                    <p>Back Home</p>
                </Link>
            </div>
            

            <div className={"forum-category"}>
                <div className={"forum-category-header"}>
                    <div className={"forum-category-header-row"}>
                        <div className={"forum-category-header-row-item"}>
                            <p>Subject</p>
                        </div>
                        <div className={"forum-category-header-row-item"}>
                            <p>Description</p>
                        </div>
                        <div className={"forum-category-header-row-item"}>
                            <p>Threads</p>
                        </div>
                        <div className={"forum-category-header-row-item"}>
                            <p>Posts</p>
                        </div>
                    </div>
                </div>

                <div className={"forum-category-body"}>
                    <ForumCategories />
                </div>
            </div>
        </div>
    );
}
 
export default ForumRoot;