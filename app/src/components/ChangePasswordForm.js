import React, { useState } from "react";
import _ from "lodash";
import { validPassword, confirmPassword } from "../validators/JoiValidator";
import { useHistory } from "react-router-dom";
import axios from "axios";
axios.defaults.withCredentials = true;

const ChangePasswordForm = () => {
    const history = useHistory();
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    
    const [formErrors, setFormErrors] = useState({
        errors: false,
        messages: []
    })

    const handlePasswordInput = (e) => {
        setPassword(e.target.value);
    }

    const handleNewPasswordInput = (e) => {
        const currentUserInput = e.target.value
        setNewPassword(currentUserInput);

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

    const handleConfirmNewPasswordInput = (e) => {
        setConfirmNewPassword(e.target.value);
    }

    const AxiosRequest = () => {
        axios.post("http://localhost:8080/forum/account/changepassword", {
            password, newPassword
        })
        .then((serverReply) => {
            serverReply = serverReply.data;

            if(serverReply.serverReplied) {
                console.log(serverReply.serverReplied)
                history.push(`/account`);
            }
            else {
                setFormErrors({
                    errors: true,
                    messages: [serverReply.errors]
                });

                setPassword("");
                setNewPassword("");
                setConfirmNewPassword("");
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }
    const handlePasswordSubmittion = (e)  =>  {
        e.preventDefault();      

        const isPasswordValid = validPassword(password);
        const isNewPasswordValid = validPassword(newPassword);
        const isConfirmValid = confirmPassword(newPassword, confirmNewPassword);
        const arePasswordsSame = confirmPassword(password, newPassword);

        const formErrorMessages = [];
        if(!isPasswordValid.validated) {
            formErrorMessages.push("Please enter a correct password.");
        }
        if(!isNewPasswordValid.validated) {
            formErrorMessages.push("New Password must be valid.")
        }
        if(isNewPasswordValid.validated && !isConfirmValid.validated) {
            formErrorMessages.push("New password must match.")
        }
        if(arePasswordsSame.validated) {
            formErrorMessages.push("New Password cannot be the same as old password.")
        }

        if(formErrorMessages.length > 0) {
            setFormErrors({
                errors: true,
                messages: formErrorMessages
            })
        }
        else {
            AxiosRequest();
        }
        console.log(formErrorMessages)
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
                    <input type={"text"} className={"input-pending"} name={"password"} value={password} onChange={handlePasswordInput}/>
                    <br/>
                    <label htmlFor={"new-password"}>New Password</label>
                    <input type={"text"} className={"input-pending"} name={"new-password"} value={newPassword} onChange={handleNewPasswordInput}/>
                    <br/>
                    <label htmlFor={"confirm-new-password"}>Confirm New Password</label>
                    <input type={"text"} className={"input-pending"} name={"confirm-new-password"} value={confirmNewPassword} onChange={handleConfirmNewPasswordInput}/>
                    <br/>
                    <input type={"submit"} />
                </form>
            </div>
            
        </div>
    );
}
 
export default ChangePasswordForm;  