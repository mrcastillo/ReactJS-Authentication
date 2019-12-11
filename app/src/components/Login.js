import React, { useState, useContext} from "react";
import { Link, useHistory } from "react-router-dom";
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

        if(!emailValidation.validated) {
            const allErrors = [...emailValidation.errors];

            setFormErrors({
                errors: true,
                messages: allErrors
            });

            console.log("Logged Into Account!");

            setEmail("");
            setPassword("");
        } else {
            console.log("Logged Into Account!");
            axios.post("http://localhost:8080/forum/login", {
                email,
                password
            })
            .then((userSession) => {
                userSession = userSession.data;
                console.log(userSession);
                if(userSession.user.length > 0) {
                    setEmail("");
                    setPassword("");
                    dispatch({
                        type: "SESSION_SET",
                        action: userSession
                    });
                    history.push("/profile")
                }
                
            })
            .catch((err) => {
                console.error(err);
                setEmail("");
                setPassword("");
            });

            
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
                <form onSubmit={handleSubmit}>
                    <label>Email/Username</label>
                    <input type={"text"} value={email} onChange={handleEmailInput}/>

                    <label>Password</label>
                    <input type={"text"} value={password} onChange={handlePasswordInput}/>
                    
                    <br/>

                    <input type={"submit"} value={"Login"}/>
                </form>
            </div>
        </div>
     );
}
 
export default Login;