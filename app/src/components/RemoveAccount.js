import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { validPassword, confirmPassword } from "../validators/Validator";
import { Link } from "react-router-dom";
import _ from "lodash";
import axios from "axios";
axios.defaults.withCredentials = true;

const RemoveAccount = () => {
    const history = useHistory();
    
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");

    const [formErrors, setFormErrors] = useState({
        errors: false,
        messages: []
    });
    const handlePasswordInput = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmedPasswordInput = (e) => {
        setConfirmedPassword(e.target.value);
    };

    const removeAccount = (e) => {
        e.preventDefault();

        const passwordValidator = validPassword(password);
        const confirmValidator = confirmPassword(password, confirmedPassword);

        if(!passwordValidator.validated || !confirmValidator.validated) {
            
            const allErrors = [
                ...passwordValidator.errors,
                ...confirmValidator.errors
            ];

            setFormErrors({
                errors: true,
                messages: allErrors
            });
            setPassword("");
            setConfirmedPassword("");
        }
        else {
            axios.post("http://localhost:8080/forum/account/delete", {
                password
            })
            .then((serverReply) => {
                console.log(serverReply);
            })
            .catch((err) =>  {
                console.error(err);
            })
        }
    };

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
        <div className={"remove-account"}>
            <h1>Delete my Account</h1>
            <p>Are you sure you want to remove your account?</p>
            
            <h3>Please enter your credentials in order to remove your password.</h3>

            <FormErrorsElement />
            <div className={"remove-account-form"}>
                <form onSubmit={removeAccount}>
                    <label htmlFor={"password"}>Password</label>
                    <input type={"password"} name={"password"} value={password} onChange={handlePasswordInput}/>
                    <br />
                    <label htmlFor={"cpassword"}>Confirm Password</label>
                    <input type={"password"} name={"cpassword"} value={confirmedPassword} onChange={handleConfirmedPasswordInput}/>
                    <br/>
                    <input type={"submit"} value={"Remove My Account"} />
                </form>
            
            </div>
        </div>
     );
}
 
export default RemoveAccount;