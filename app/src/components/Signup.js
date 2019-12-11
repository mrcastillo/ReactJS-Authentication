import React, { useState } from "react";
import { Link, useHistory} from "react-router-dom";
import { isEmail, validPassword, confirmPassword } from "../validators/Validator";
import _ from "lodash";
import bcrypt from "bcryptjs";
import axios from "axios";

const Signup = () => {
    const history = useHistory();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");

    const [formErrors, setFormErrors] = useState({
        errors: false,
        messages: []
    });

    const handleEmailInput = (e) => {
        setEmail(e.target.value);
    }

    const handlePasswordInput = (e) => {
        setPassword(e.target.value);
    }

    const handleConfirmedPasswordInput = (e) => {
        setConfirmedPassword(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const emailValidation = isEmail(email);
        const passwordValidation = validPassword(password);
        const confirmPasswordValidation = confirmPassword(password, confirmedPassword)
        
        if(!emailValidation.validated || !passwordValidation.validated || !confirmPasswordValidation.validated) {
            console.log("Form Errors....")
            const allErrors = [
                ...emailValidation.errors,
                ...passwordValidation.errors,
                ...confirmPasswordValidation.errors
            ];

            setFormErrors({
                errors: true,
                messages: allErrors
            });

            setEmail("");
            setPassword("");
            setConfirmedPassword("");
            return;
        }
        else {
            bcrypt.genSalt(10, (err, salt) => {
                if(err){
                    console.error(err);
                    return;
                };
                bcrypt.hash(password, salt, (err, hash) => {
                    if(err) {
                        console.error(err);
                        return;
                    };
                    
                    axios.post("http://localhost:8080/forum/signup", {
                        email,
                        password: hash
                    })
                    .then((result) => {
                        if(result.data) {
                            SuccessfulSignUp();
                            return;
                        }
                        else {
                            setFormErrors({
                                errors: true,
                                messages: ["There was a signup error."]
                            });
                            setEmail("");
                            setPassword("");
                            setConfirmedPassword("");
                            return;
                        }
                    })
                    .catch((err) => {
                        setEmail("");
                        setPassword("");
                        setConfirmedPassword("");
                        return;
                    });
                });
            })
        }
    }

    //Form Error
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

    function SuccessfulSignUp() {
        history.push("/");
    };

    return ( 
        <div className={"login"}>
            <h1>Create a New Account.</h1>
            <p>Or <Link to={"/login"}>Login</Link></p>

            <FormErrorsElement />
            <div>
                <form method={"POST"} onSubmit={handleSubmit}>
                    <label>Email/Username</label>
                    <input type={"text"} value={email} onChange={handleEmailInput}/>

                    <label>Password</label>
                    <input type={"text"} value={password} onChange={handlePasswordInput}/>
                    
                    <label>Confirm Password</label>
                    <input type={"text"} value={confirmedPassword} onChange={handleConfirmedPasswordInput}/>
                    <br/>

                    <input type={"submit"} value={"Create Account"}/>
                </form>
            </div>
        </div>
     );
}
 
export default Signup;
/*
const signupPost = async (hash) => {
    try {
        const result = await axios.post("http://localhost:8080/forum/signup", {
            email,
            password: hash
        });
        if(result.data){
            SuccessfulSignUp();
        }
        else {
            setFormErrors({
                errors: true,
                messages: ["There was a signup error."]
            });
        }
        console.log("We made the signup request", result)
    } catch (err) {
        console.error("Error with signup request", err);
    } finally {
        setEmail("");
        setPassword("");
        setConfirmedPassword("");
        return;
    }
};
*/


