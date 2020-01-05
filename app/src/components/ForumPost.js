import React, { useState, useEffect } from "react";
import { Link, Route, Switch } from "react-router-dom";
import _ from "lodash";
import axios from "axios";

import NewPost from "./NewPost";

const ForumPost = (props) => {
    const [posts, setPosts] = useState([]); //Post array  to store our posts
    const categoryId = props.category.id;
    const threadId = props.props.match.params.threadId;
    var subject = props.category.subject;

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

            _.each(replies, (reply) => {
                repliesElement.push(
                    <div>
                        <p>Poster: {reply.user.email}</p>
                        <p>{reply.postComment}</p>
                    </div>
                )
            });

            return (
                <div>
                    <div>
                        <p>Poster: {posts.originalPoster}</p>
                        <h1>{posts.threadTitle}</h1>
                        <p>{posts.originalComment}</p>
                    </div>

                    {repliesElement}        
                </div>
            )            
        }
        else {
            return(
                <div>Loading....</div>
            )
        }
    };

    return ( 
        <div>
            <h1><Link to={`/forum/${trimLowerCase(subject)}`}>Back</Link></h1>
            <hr />
            <Link to={`/forum/${trimLowerCase(subject)}/${threadId}/post`}>New Post</Link>
            
            <Route path={`${URL}`} render={(props) => <PostElement />} />
            <Route path={`${URL}/post`} component={(props) => <NewPost URL={URL} threadId={threadId}/>} />
        </div>
     );
}
 
export default ForumPost;

//<Link to={`/forum/${trimLowerCase(subject)}/${threadId}/post`}>New Post</Link>