/*
    Rendered for URL/forum/:category
*/
import React, { useState, useEffect } from "react";
import { Link, Switch, Route } from "react-router-dom";
import AuthRedirect from "./AuthRedirect";
import axios from "axios";
import _ from "lodash";

import bullet from "../images/bullet.png";
import mushroom from "../images/mushroom.png";

//Components
import ForumPost from "./ForumPost";
import CreateThread from "./CreateThread";

const ForumThreads = (props) => {
    //State to store threads
    const [threads, setThreads] = useState([]);

    //Get the pathname for our current catagory
    const URL = props.match.path;

    const categoryId = props.category.id; //Get our categoryId so we can request from server our subjects
    const subject = props.category.subject; //Get the subject to display for HTML
    const category = props.category; // Category props allow us to use subject information in our forumPost route

    const trimLowerCase = (text) => {
        var newText = text.replace(/\s+/g, '');
        newText = newText.toLowerCase();
        return newText;
    }

    useEffect(() => {
        const getThreads = async () => {
            const threadsData = await axios.get(`http://localhost:8080/forum/${categoryId}`);
            setThreads(threadsData.data);
        }
        getThreads();
    }, []);

    //Element to display our Forum Threads
    const ForumThreads = () => {
        //Check if threads have length(true once axios returns threads)
        if(threads.length > 0) {
            console.log("threads", threads)
            const threadsHTML = []; //Empty array for our thread elements

            _.each(threads, (thread, key) => { //Each thread
                threadsHTML.push( //Push threadsHTML element
                    <div className={"forum-threads-body-row"} key={key}>
                        <p className={"forum-threads-body-row-item"} id={"thread-title"}>
                            <Link to={`${URL}/${thread.id}`}>{thread.threadTitle}</Link>
                        </p>
                        <p className={"forum-threads-body-row-item"} id={"thread-poster"}>{thread.user ? thread.user.username : "Deleted User"}</p>
                        <p className={"forum-threads-body-row-item"} id={"thread-replies"}>2</p>
                        <p className={"forum-threads-body-row-item"} id={"thread-createAt"}>{thread.createdAt}</p>
                    </div>
                );
            });
            return (
                <React.Fragment>
                    {threadsHTML}
                </React.Fragment>
            )
        }
        else { //Threads have not been returned or no threads
            return (
                <tr>
                    <td>Threads Unavailable</td>
                </tr>
            )
        }
    }

    const ForumThreadsRoot = (props) => {
        return(
            <div className={"forum-threads"}>
                <h1 id={"forum-threads-subject-name"}>{subject}</h1>
                <p>Introduce yourself</p>
                <ul>
                    <li>Read Forum Rules - <span>Forum Rules</span></li>
                    <li>
                        Accounts can be removed at any moment.
                    </li>
                </ul>

                <div className={"action-select"}>
                    <Link to={"/forum"} id={"site-button-2"}>
                        <img src={bullet} width={35} height={25}/>
                        <p>Back</p>
                    </Link>
                    <Link to={"/post/newthread"} id={"site-button-2"}>
                        <img src={mushroom} width={25} height={25}/>
                        <p>New Thread</p>
                    </Link>
                </div>
                
                
                
                <div className={"forum-threads-box"}>
                    <div className={"forum-threads-header"}>
                        <div className={"forum-threads-header-row"}>
                            <p className={"forum-threads-header-row-item"}>Subject</p>
                            <p className={"forum-threads-header-row-item"}>User</p>
                            <p className={"forum-threads-header-row-item"} id={"forum-threads-replies"}>Replies</p>
                            <p className={"forum-threads-header-row-item"}>Created At</p>
                        </div>
                    </div>

                    <div className={"forum-threads-body"}>
                        <ForumThreads />
                    </div>
                </div>
            </div>
        )
    }

    const NoMatch = () => {
        return(
            <div>Sorry..No Match!</div>
        )
    }

    return ( 
        <React.Fragment>
            <Switch>
                <Route exact path={`${URL}/post/newthread`} render={(props) => <AuthRedirect><CreateThread props={props} category={category} /></AuthRedirect>}/>
                <Route path={`${URL}/:threadId`} render={(props) => <ForumPost props={props} category={category} />} />
                <Route exact path={`${URL}`} render={(props) => <ForumThreadsRoot {...props}/>}/>
                <Route component={NoMatch} />
            </Switch>
        </React.Fragment>
    );
}
 
export default ForumThreads;