import React, { useState } from "react";
import { Link, useHistory} from "react-router-dom";
import { isEmail, validPassword, confirmPassword } from "../validators/JoiValidator";
import _ from "lodash";
import bcrypt from "bcryptjs";
import axios from "axios";

const Signup = () => {
    const history = useHistory();
    //Set States for Signup Page
    const [email, setEmail] = useState(""); //Email
    const [password, setPassword] = useState(""); //Password
    const [confirmedPassword, setConfirmedPassword] = useState(""); //Repeat Password
    const [formErrors, setFormErrors] = useState({ //Form Errors 
        errors: false,
        messages: []
    });

    const handleEmailInput = (e) => { //Update email input
        setEmail(e.target.value);
    }

    const handlePasswordInput = (e) => { //Update password input
        setPassword(e.target.value);
    }

    const handleConfirmedPasswordInput = (e) => { //Update repeat password input
        setConfirmedPassword(e.target.value);
    }

    //FORM SUBMITTION
    const handleSubmit = (e) => {
        e.preventDefault(); //Stops page refresh
        const validEmail = isEmail(email); //validate email
        const isValidPassword = validPassword(password); //validate password 
        const validRepeatPassword = confirmPassword(confirmedPassword); //validate repeat password
        console.log(validEmail)
        if(!validEmail.validated || !isValidPassword.validated || validRepeatPassword.validated) {
            
            //Create error array that will list the validation errors.
            const allErrors = [
                validEmail.errors,
                isValidPassword.errors,
                validRepeatPassword.errors
            ]
            setEmail("");
            setPassword("");
            setConfirmedPassword("");

            setFormErrors({
                errors: true,
                messages: allErrors
            });
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
                    .then((signupResult) => {
                        signupResult = signupResult.data;
                        if(signupResult.errors) {
                            setFormErrors({
                                errors: true,
                                messages: signupResult.errors
                            });
                            setEmail("");
                            setPassword("");
                            setConfirmedPassword("");
                        }
                        else {
                            history.push("/");
                        }
                    })
                    .catch((err) => {
                        setFormErrors({
                            errors: true,
                            messages: ["There was an internal server error."]
                        });
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
                    <input type={"text"} value={email} onChange={handleEmailInput} required/>

                    <label>Password</label>
                    <input type={"text"} value={password} onChange={handlePasswordInput} required/>
                    
                    <label>Confirm Password</label>
                    <input type={"text"} value={confirmedPassword} onChange={handleConfirmedPasswordInput} required/>
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


