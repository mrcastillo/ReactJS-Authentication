import React, { useState } from "react";
import _ from "lodash";
import { validPassword, confirmPassword } from "../validators/Validator";
import bcrypt from "bcryptjs";
import { useHistory } from "react-router-dom";
import axios from "axios";
axios.defaults.withCredentials = true;

const ChangePasswordForm = () => {
    const history = useHistory();
    const [password, setPassword] = useState("");
    const [newPassword, setnewPassword] = useState("");
    const [confirmNewPassword, setconfirmNewPassword] = useState("");
    
    const [formErrors, setFormErrors] = useState({
        errors: false,
        messages: []
    })

    const handlePasswordInput = (e) => {
        setPassword(e.target.value);
    }

    const handleNewPasswordInput = (e) => {
        setnewPassword(e.target.value);
    }

    const handleConfirmNewPasswordInput = (e) => {
        setconfirmNewPassword(e.target.value);
    }

    const handlePasswordSubmittion = (e)  =>  {
        e.preventDefault();
        
        const passwordValidation = validPassword(password);
        const newPasswordValidation = validPassword(newPassword);
        const confirmNewPasswordLengthValidation = validPassword(confirmNewPassword);
        const confirmNewPasswordValidation = confirmPassword(newPassword, confirmNewPassword);
        

        if(!passwordValidation.validated || !newPasswordValidation.validated || !confirmNewPasswordValidation.validated || !confirmNewPasswordLengthValidation.validated){

            //newPasswordValidation.errors = ["New Password must be between 8 to 64 characters."];
            //confirmNewPasswordLengthValidation.errors = "";

            const allErrors = [
                ...passwordValidation.errors,
                ...newPasswordValidation.errors,
                ...confirmNewPasswordValidation.errors
            ]

            setFormErrors({
                errors: true,
                messages: allErrors
            });
            setPassword("")
            setnewPassword("")
            setconfirmNewPassword("")
        }
        else {
            console.log("Validated!");
        
            axios.post("http://localhost:8080/forum/account/changepassword", {
                password, newPassword
            })
            .then((serverReply) => {
                serverReply = serverReply.data;
                if(serverReply.status) {
                    history.push(`/account`);
                }
                else {
                    setFormErrors({
                        errors: true,
                        messages: ["There was an error changing the password.", serverReply.errors]
                    });
                }
            })
            .catch((err) => {
                console.log(err);
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
        <div className={"change-password"}>
            Account > Password Settings
            <h1>Change Password</h1>
            <p>Change password form</p>

            <div className={"password-settings-form"}>  
                <FormErrorsElement />
                
                <form onSubmit={handlePasswordSubmittion}>
                    <label htmlFor={"password"}>Current Password</label>
                    <input type={"text"} name={"password"} value={password} onChange={handlePasswordInput}/>
                    <br/>
                    <label htmlFor={"new-password"}>New Password</label>
                    <input type={"text"} name={"new-password"} value={newPassword} onChange={handleNewPasswordInput}/>
                    <br/>
                    <label htmlFor={"confirm-new-password"}>Confirm New Password</label>
                    <input type={"text"} name={"confirm-new-password"} value={confirmNewPassword} onChange={handleConfirmNewPasswordInput}/>
                    <br/>
                    <input type={"submit"} />
                </form>
            </div>
            
        </div>
    );
}
 
export default ChangePasswordForm;  