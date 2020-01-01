import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import _ from "lodash";
import axios from "axios";

const ForumPost = (props) => {

    const [posts, setPosts] = useState([]);

    const categoryId = props.category.id;
    const threadId = props.props.match.params.threadId;
    console.log(props.category.subject)
    var subject = props.category.subject;

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
        
        if(posts.length > 0) {
            console.log(posts)
            const postElement = [];
            _.each(posts, (post, key) => {
                postElement.push(
                <tr key={key}>
                    <td>{post.id}</td>
                    <td>{post.user.email}</td>
                    <td>{post.postComment}</td>
                    <td>{post.createdAt}</td>
                </tr>
                )
            });

            return (
                <React.Fragment>
                    {postElement}
                </React.Fragment>
            )
            
        }
        else {
            return(
                <tr>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                </tr>
            )
        }
    };

    return ( 
        <div>
            <h1><Link to={`/forum/${trimLowerCase(subject)}`}>Back</Link></h1>
            <hr />
            <table>
                <thead>
                    <tr>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td><Link to={"/"}>New Post</Link></td>
                    </tr>
                    <tr>
                        <td>Id</td>
                        <td>User</td>
                        <td>Comment</td>
                        <td>Date</td>
                    </tr>
                </thead>
                <tbody>
                    <PostElement />
                </tbody>
            </table>
        </div>
     );
}
 
export default ForumPost;