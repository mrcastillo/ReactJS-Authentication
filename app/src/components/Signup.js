import React, { useState } from "react";
import { Link, useHistory} from "react-router-dom";
import { 
    isEmail, 
    validPassword, 
    confirmPassword,
    alphanumericUsername,
    hasNumeric, //These will be used for password strength
    hasUppercase,
    hasLowercase,
    hasNonAlphanumeric } from "../validators/JoiValidator";
import _ from "lodash";
import bcrypt from "bcryptjs";
import axios from "axios";

const Signup = () => {
    const history = useHistory();
    //Set States/Variables for Signup Page
    const [username, setUsername] = useState(""); //username
    const [email, setEmail] = useState(""); //Email
    const [password, setPassword] = useState(""); //Password
    const [confirmedPassword, setConfirmedPassword] = useState(""); //Repeat Password
    const [formErrors, setFormErrors] = useState({ //Form Errors 
        errors: false,
        messages: []
    });

    const handleUsernameInput = (e) => { //Update repeat password input
        const currentUserInput = e.target.value;
        setUsername(e.target.value.toLowerCase());

        if(alphanumericUsername(currentUserInput).validated && currentUserInput.length > 2) {
            e.target.className = "input-valid";
        } else {
            if(currentUserInput.length > 0) {
                e.target.className = "input-invalid"
            } else {
                e.target.className = "input-pending";
            }
        }
    };

    const handleEmailInput = (e) => { //Update email input
        const currentUserInput = e.target.value; //Gets userInput from event.target.value
        setEmail(currentUserInput); //Sets userinput into email state
        
        //Check if the email is validated using Joi Validator
        if(isEmail(currentUserInput).validated) {
            e.target.className = "input-valid"; //Sets target classname to input-valid(green border)
        } else {
            //Set border color based on input
            if(currentUserInput.length > 0) {
                e.target.className = "input-invalid";
            }
            else {
                e.target.className = "input-pending";
            }
        }
    };

    const handlePasswordInput = (e) => { //Update password input
        const currentUserInput = e.target.value; //Gets userInput from event.target.value
        setPassword(currentUserInput); //Sets userinput into email state
       
        if(validPassword(currentUserInput).validated) {
            e.target.className = "input-valid";
        }
        else {
            if(currentUserInput.length > 0) {
                e.target.className = "input-invalid";
            }
            else {
                e.target.className = "input-pending";
            }
        }
    }

    const handleConfirmedPasswordInput = (e) => { //Update repeat password input
        setConfirmedPassword(e.target.value);
    }

    //FORM SUBMITTION
    const handleSubmit = (e) => {
        e.preventDefault(); //Stops page refresh
        const validUsername = alphanumericUsername(username); //Validate username
        const validEmail = isEmail(email); //validate email
        const isValidPassword = validPassword(password); //validate password 
        const validRepeatPassword = confirmPassword(password, confirmedPassword); //validate repeat password
        
        if(!validUsername.validated || !validEmail.validated || !isValidPassword.validated || !validRepeatPassword.validated) {
            if(validEmail.error) setEmail("");
            if(isValidPassword.error) setPassword("");
            setConfirmedPassword("");

            //Create error array that will list the validation errors.
            const allErrors = [
                validEmail.error,
                isValidPassword.error,
                validRepeatPassword.error
            ];

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
                        username,
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
    };

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
        <div className={"signup-page"}>
            <h1>Create a New Account.</h1>
            <p>Or <Link to={"/login"}>Login</Link></p>

            <FormErrorsElement />
            <div>
                <form method={"POST"} onSubmit={handleSubmit}>

                    <label htmlFor={"email"}>Email</label>
                    <input type={"text"} id={"email"} value={email} onChange={handleEmailInput} required/>

                    <label htmlFor={"username"}>Username</label>
                    <input type={"text"} id={"username"} value={username} onChange={handleUsernameInput} required />

                    <label>Password</label>
                    <input type={"password"} value={password} onChange={handlePasswordInput} required/>
                    
                    <label>Confirm Password</label>
                    <input type={"password"} value={confirmedPassword} onChange={handleConfirmedPasswordInput} required/>
                    
                    <br/>

                    <input type={"submit"} value={"Create Account"}/>
                </form>
            </div>
        </div>
     );
}
 
export default Signup;