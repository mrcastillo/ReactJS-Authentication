import React, { useState, useContext} from "react";
import { Link, useHistory } from "react-router-dom";
import { SessionContext } from "../context/SessionContext";
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

    const AxiosRequest = () => {
        axios.post("http://localhost:8080/forum/login", {
            email, password
        })
        .then((loginReplyAxios) => {
            const loginReply = loginReplyAxios.data;

            //Check if server returned  errors
            if(loginReply.errors) {
                setFormErrors({
                    errors: true,
                    messages: loginReply.errors
                });
                setPassword("");
            }
            else {
                dispatch({
                    type: "SESSION_SET",
                    loginSession: loginReply
                });
                history.push("/account")
            };
        })
        .catch((error) => {
            setPassword("");
            setFormErrors({
                errors: true,
                messages: ["There was an internal server error. Please try again later."]
            });
            
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault();

        const emailLengthValid = email.length > 0 ? true : false;
        const passwordLengthValid = password.length > 0 ? true : false;

        if(!emailLengthValid) {
            var errorMsgs = ["Please enter an Email."];
            setFormErrors({
                errors: true,
                messages: errorMsgs
            })
        } else if (emailLengthValid && !passwordLengthValid) {
            var errorMsgs = ["Please enter a Password"];
            setFormErrors({
                errors: true,
                messages: errorMsgs
            })
        } else {
            AxiosRequest();
        }
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
                    <label htmlFor={"password"}>Email or Username</label>
                    <input type={"text"} name={"email"} value={email} onChange={handleEmailInput} />

                    <label htmlFor={"password"}>Password</label>
                    <input type={"password"} name={"password"} value={password} onChange={handlePasswordInput} />
                    
                    <br/>

                    <input type={"submit"} value={"Login"} />
                </form>
            </div>
        </div>
     );
}
 
export default Login;