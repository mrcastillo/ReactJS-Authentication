import React, { useState } from "react";
import { Link, Route } from "react-router-dom";
import _ from "lodash";

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
                    <tr key={key}>
                        <td><Link to={`${URL}/${categoryURL}`}>{category.subject}</Link></td>
                        <td>{category.description}</td>
                        <td>{category.threads}</td>
                        <td>{category.posts}</td>
                    </tr>
                )
            });
        }
        
        return(
            <React.Fragment>
                {categoryElements}
            </React.Fragment>
        )
    }
    
    return (
        <React.Fragment>
            <h1><Link to={"/"}>Back Home</Link></h1>
            
            <div className={"forum"}>
                <table>
                    <thead>
                        <tr>
                            <td>Subject</td>
                            <td>Description</td>
                            <td>Threads</td>
                            <td>Posts</td>
                        </tr>
                    </thead>
                    <tbody>
                        <ForumCategories />
                    </tbody>
                </table>
            </div>
        </React.Fragment>
    );
}
 
export default ForumRoot;