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
import axios from "axios";

const Signup = () => {
    const history = useHistory();
    //Set States/Variables for Signup Page
    const [username, setUsername] = useState(""); //username
    const [email, setEmail] = useState(""); //Email
    const [password, setPassword] = useState(""); //Password
    const [confirmedPassword, setConfirmedPassword] = useState(""); //Repeat Password
    const [formError, setFormErrors] = useState({ //Form Errors 
        error: false,
        message: []
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
    const handleSubmit = async (e) => {
        e.preventDefault(); //Stops page refresh
        setFormErrors({error: false});
        const validEmail = isEmail(email); //validate email
        const validUsername = alphanumericUsername(username); //Validate username
        const isValidPassword = validPassword(password); //validate password 
        const validConfirmedPassword = confirmPassword(password, confirmedPassword); //validate repeat password
        
        const validations = [validEmail, validUsername, isValidPassword, validConfirmedPassword];

        const validationError = _.find(validations, (validation) => {
            return validation.error;
        });

        if(!validationError) {
            let signUpRequest = await axios.post("http://localhost:8080/account/signup", {
                email, username, password
            });

            signUpRequest = signUpRequest.data;

            if(!signUpRequest.error) {
                history.push("/login");
                return;
            } else {
                setFormErrors({error: signUpRequest.error, message: signUpRequest.message })
                return;
            }
        } else {
            setFormErrors({error: true, message: [validationError.error]});
            setPassword(""); setConfirmedPassword("");
            return;
        }
    };

    //Form Error
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
                    <input type={"text"} id={"email"} value={email} onChange={handleEmailInput}/>

                    <label htmlFor={"username"}>Username</label>
                    <input type={"text"} id={"username"} value={username} onChange={handleUsernameInput} />

                    <label>Password</label>
                    <input type={"password"} value={password} onChange={handlePasswordInput}/>
                    
                    <label>Confirm Password</label>
                    <input type={"password"} value={confirmedPassword} onChange={handleConfirmedPasswordInput}/>
                    
                    <br/>

                    <input type={"submit"} value={"Create Account"}/>
                </form>
            </div>
        </div>
     );
}
 
export default Signup;