import React, { useState, useEffect } from "react";
import { Link, Switch, Route } from "react-router-dom";
import AuthRedirect from "./AuthRedirect";
import axios from "axios";
import _ from "lodash";

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
            const threadsHTML = []; //Empty array for our thread elements

            _.each(threads, (thread, key) => { //Each thread
                threadsHTML.push( //Push threadsHTML element
                    <tr key={key}>
                        <td><Link to={`${URL}/${thread.id}`}>{thread.postSubject}</Link></td>
                        <td>2</td>
                        <td>{thread.user.email}</td>
                        <td>{thread.createdAt}</td>
                    </tr>
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
                    <td>Loading...</td>
                </tr>
            )
        }
    }

    const ForumThreadsRoot = (props) => {
        return(
            <div className={"forum"}>
                <h1><Link to={"/forum"}>Back to forum</Link></h1>
                <h1>{subject}</h1>
                <table>
                    <thead>
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td><Link to={`${URL}/post/newthread`}>New Thread</Link></td>
                        </tr>
                        <tr>
                            <td>Subject</td>
                            <td>Replies</td>
                            <td>User</td>
                            <td>Created At</td>
                        </tr>
                    </thead>
                    <tbody>
                        <ForumThreads />
                    </tbody>
                </table>
            </div>
        )
    }

    const NoMatch = () => {
        return(
            <div>Sorry..No Match!</div>
        )
    }

    return ( 
        <div>
            <Switch>
                <Route exact path={`${URL}`} render={(props) => <ForumThreadsRoot {...props}/>}/>
                <Route exact path={`${URL}/:threadId`} render={(props) => <ForumPost props={props} category={category}/>} />
                <Route exact path={`${URL}/post/newthread`} render={(props) => <AuthRedirect><CreateThread props={props} category={category} /></AuthRedirect>}/>
                <Route component={NoMatch} />
            </Switch>
        </div>
    );
}
 
export default ForumThreads;