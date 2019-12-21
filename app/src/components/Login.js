import React, { useState, useContext} from "react";
import { Link, useHistory } from "react-router-dom";
import { sessionSet } from "../functions/sessionFunctions";
import { SessionContext } from "../context/SessionContext";
import { isEmail } from "../validators/Validator";
import _ from "lodash";
import axios from "axios";

const Login = () => {
    const { dispatch } = useContext(SessionContext);
    const history = useHistory();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [formErrors, setFormErrors] = useState({
        errors: false,
        messages: []
    })

    const handleEmailInput = (e) => {
        setEmail(e.target.value);
    }

    const handlePasswordInput = (e) => {
        setPassword(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const emailValidation = isEmail(email);

        if(emailValidation.validated) {
            console.log("input validated!");

            axios.post("http://localhost:8080/forum/login", {
                email, password
            })
            .then((loginReplyAxios) => {
                const loginReply = loginReplyAxios.data;

                //Check if server returned 
                if(loginReply.errors) {
                    setFormErrors({
                        errors: true,
                        messages: loginReply.errors
                    });
                }
                else {
                    dispatch({
                        type: "SESSION_SET",
                        loginSession: loginReply
                    });
                };
            })
            .catch((error) => {
                console.log(error)
                setFormErrors({
                    errors: true,
                    messages: ["There was an internal server error. Please try again later."]
                })
            })
        }
        else {
            const allErrors = [...emailValidation.errors];

            setFormErrors({
                errors: true,
                messages: allErrors
            });

            console.log("There were errors!");

            setEmail("");
            setPassword("");
        };
    }

    //Form Errors
    function FormErrorsElement() {
        const formErrorsElement = [];

        if(formErrors.errors) {
            _.each(formErrors.messages, (message, key) => {
                formErrorsElement.push(
                    <div className={"form-error"} key={key}>
                        {message}
                    </div>
                );
            });
        } 
        else {
            formErrorsElement.push(<div key={1}></div>)
        };

        return (
            <div className={"form-errors"}>
                {formErrorsElement}
            </div>
        );
    };
    
    return ( 
        <div className={"login"}>
            <h1>Login to your account.</h1>
            <p>Or <Link to={"/signup"}>Sign up</Link></p>

            <FormErrorsElement />
            <div>
                <form onSubmit={handleSubmit} method={"POST"}>
                    <label>Email/Username</label>
                    <input type={"text"} name={"email"} value={email} onChange={handleEmailInput}/>

                    <label>Password</label>
                    <input type={"text"} name={"password"} value={password} onChange={handlePasswordInput}/>
                    
                    <br/>

                    <input type={"submit"} value={"Login"} />
                </form>
            </div>
        </div>
     );
}
 
export default Login;