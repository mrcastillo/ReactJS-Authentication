import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { SessionContext } from "../context/SessionContext";
import axios from "axios";

const CreateThread = (props) => {
    //Have access to category ID
    console.log("create threads", props)
    const history = useHistory();
    const { session } = useContext(SessionContext);

    const [userTitleInput, setUserTitleInput] = useState("");
    const [userCommentInput, setUserCommentInput] = useState("");
    
    const handleTitleInput = (event) => {
        setUserTitleInput(event.target.value);
    };

    const handleCommentInput = (event) => {
        setUserCommentInput(event.target.value);
    };

    const handleSubmitInput = (event) => {
        event.preventDefault();
        axios.post("http://localhost:8080/forum/newthread", {
            title: userTitleInput,
            comment: userCommentInput,
            forumSubjectId: props.category.id
        })
        .then((newPost) => {
            console.log(newPost);
            history.push("/forum");
        })
        .catch((error) => {
            console.error(error);
        })
    };

    return ( 
        <div>
            <p>Forum --> {props.category.subject} --> New Thread</p>
            <p>Username: {session.user}</p>

            <form onSubmit={handleSubmitInput}>
                <label htmlFor={"title"}>Title</label>
                <input type={"text"} id={"title"} value={userTitleInput} onChange={handleTitleInput} />
                <br/>
                <label htmlFor={"bodytext"}>Body</label>
                <textarea rows={10} cols={50} id={"bodytext"} value={userCommentInput} onChange={handleCommentInput} />
                <br />
                <input type={"submit"} value={"Create New Post"} />
            </form>
        </div>
     );
}
 
export default CreateThread;