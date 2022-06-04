import React, { useState, useEffect } from "react";
import { Link, Route, Switch } from "react-router-dom";
import _ from "lodash";
import axios from "axios";

import NewPost from "./NewPost";

import bullet from "../images/bullet.png";
import mushroom from "../images/mushroom.png";
import wario from "../images/elonwario.jpg";

const ForumPost = (props) => {
    console.log("Hey", props)
    const [posts, setPosts] = useState([]); //Post array  to store our posts
    const categoryId = props.category.id;
    const threadId = props.props.match.params.threadId;

    const subject = props.category.subject;
    var subjectFormatted = props.category.subject;
    subjectFormatted = subjectFormatted.replace(/\s+/g, '');
    subjectFormatted = subjectFormatted.toLowerCase();
    
    //Get the URL used for our Route Rendering for forum posts
    const URL = props.props.match.url;

    const trimLowerCase = (text) => {
        var newText = text.replace(/\s+/g, '');
        newText = newText.toLowerCase();
        return newText;
    }

    useEffect(() => {
        const getPosts = async () => {
            const postsData = await axios.get(`http://localhost:8080/forum/${categoryId}/${threadId}`);
            setPosts(postsData.data);
        }
        getPosts();
    }, []);
    

    const PostElement = () => {
        if(posts) {
            console.log("posts bro", posts.forumPosts);

            const replies = posts.forumPosts;
            const repliesElement = [];

            _.each(replies, (reply, key) => {
                repliesElement.push(
                    <div className={"forum-post"}>                    
                        <div className={"forum-poster-avatar"}>
                            <p id={"op-name"}>{reply.user.username}</p>
                            <img src={wario} />
                            <div className={"avatar-op-info"}>
                                <p>New User</p>
                                <p>Posts 100</p>
                            </div>
                        </div>
                        
                        <div>
                            <p className={"forum-post-comment"}>
                                {posts.originalComment}
                            </p>
                        </div>
                        
                    </div>
                )
            });

            return (
                <React.Fragment>
                    <div className={"forum-post"}>
                        <div className={"forum-poster-avatar"}>
                            <p id={"op-name"}>{posts.originalPoster}</p>
                            <img src={wario} />
                            <div className={"avatar-op-info"}>
                                <p>New User</p>
                                <p>Posts 100</p>
                            </div>
                        </div>
                        
                        <div>
                            <p className={"forum-post-comment"} id={"original-comment"}>
                                {posts.originalComment}
                            </p>
                        </div>
                        
                    </div>

                    {repliesElement}        
                </React.Fragment>
            )            
        }
        else {
            return(
                <div>Loading....</div>
            )
        }
    };

    return ( 
        <div className={"forum-post-container"}>
            <div className={"forum-navigation"}>
                <p>Gamer's Lounge Navi</p>
                <h1 id={"thread-title"}><Link to={"/forum"}>Forum</Link> - <Link to={`/forum/${subjectFormatted}`}> {subject} </Link> - {posts.threadTitle}</h1>
            </div>
            <br/>
            <div className={"action-select"}>
                <Link to={"/forum"} id={"site-button-2"}>
                        <img src={bullet} width={35} height={25}/>
                        <p>Back</p>
                </Link>
                <Link to={`/forum/${subjectFormatted}/${threadId}/post`} id={"site-button-2"}>
                    <img src={mushroom} width={25} height={25} />
                    <p>Post Message</p>
                </Link>
            </div>

            <br/>
            <Route path={`${URL}`} render={(props) => <PostElement />} />
            <Route path={`${URL}/post`} component={(props) => <NewPost URL={URL} threadId={threadId}/>} />
        </div>
     );
}
 
export default ForumPost;