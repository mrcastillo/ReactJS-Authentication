import React, { useContext } from "react";
import { SessionContext } from "../context/SessionContext";

const CreateThread = (props) => {
    const { session } = useContext(SessionContext);

    console.log(session);
    return ( 
        <div>
            <p>Forum --> {props.category.subject} --> New Thread</p>
            
        </div>
     );
}
 
export default CreateThread;