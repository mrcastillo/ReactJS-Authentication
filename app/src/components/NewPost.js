import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { SessionContext } from "../context/SessionContext";

const NewPost = (props) => {
    const history = useHistory();
    const [postComment, setPostComment] = useState("");
    const { session } = useContext(SessionContext); //Check login to post new message
    const threadId = props.threadId;

    const handlePostComment = (event) => {
        setPostComment(event.target.value);
    };

    const handleSubmitPost = (event) => {
        event.preventDefault();

        axios.post("http://localhost:8080/test", {
            postComment,
            threadId
        })
        .then((reply) => {
            console.log(reply);
        })
        .catch((error) => {
            console.error(error)
        })
        console.log("Submitted!");
    };

    const handleCancelPost = (event) => {
        history.push(`${props.URL}`);
    }

    return (
        <React.Fragment>
            {
                session.user ?
                (
                    <form onSubmit={handleSubmitPost}>
                        <textarea cols={50} rows={10} name={"postComment"} id={"postComment"} value={postComment} onChange={handlePostComment} />
                        <br />
                        <input type={"submit"} value={"Post Comment"}/>
                        <input type={"button"} value={"Cancel"} onClick={handleCancelPost} />
                    </form>
                ) :
                (
                    <div>
                        <h1>You must be logged in to post.</h1>
                    </div>
                )
            }
        </React.Fragment>
    );
}
 
export default NewPost;

/*
<form onSubmit={handleSubmitPost}>
    <textarea cols={50} rows={10} name={"postComment"} id={"postComment"} value={postComment} onChange={handlePostComment} />
    <br />
    <input type={"submit"} value={"Post Comment"}/>
    <input type={"button"} value={"Cancel"}/>
</form>

<div>
    <h1>You must be logged in to post.</h1>
</div>

*/