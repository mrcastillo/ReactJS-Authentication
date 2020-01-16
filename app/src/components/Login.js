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

    const [formError, setFormErrors] = useState({
        error: false,
        message: []
    })

    const handleEmailInput = (e) => {
        setEmail(e.target.value);
    }

    const handlePasswordInput = (e) => {
        setPassword(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const emailLengthValid = email.length > 0 ? true : false;
        const passwordLengthValid = password.length > 0 ? true : false;

        if(!emailLengthValid) {
            setFormErrors({
                error: true,
                message: ["Please enter an Email."]
            })
            return;
        } else if (emailLengthValid && !passwordLengthValid) {
            setFormErrors({
                error: true,
                message: ["Please enter a Password"]
            })
            return;
        } 

        try {
            let loginRequest = await axios.post("http://localhost:8080/forum/login", {email, password});
            loginRequest = loginRequest.data;

            if(!loginRequest.error) { //Successful Login
                dispatch({
                    type: "SESSION_SET",
                    loginSession: loginRequest 
                });
                history.push("/account");
            } else {
                setFormErrors({
                    error: true,
                    message: loginRequest.error
                });
                setPassword("");
            }
        } catch (e) {
            setFormErrors({
                error: true,
                message: ["There was an error when attempting to login. Please try again later."]
            })
            return;
        }
    }
    
    //Form Errors
    function FormErrorsElement() {
        const formErrorsElement = [];

        if(formError.error) {
            _.each(formError.message, (message, key) => {
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