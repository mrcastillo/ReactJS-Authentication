import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { validPassword, confirmPassword } from "../validators/JoiValidator";
import { Link } from "react-router-dom";
import _ from "lodash";
import { SessionContext } from "../context/SessionContext";
import { sessionStatus } from "../functions/sessionFunctions";
import axios from "axios";
axios.defaults.withCredentials = true;

const RemoveAccount = () => {
    const { dispatch } = useContext(SessionContext);
    
    const history = useHistory();
    
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");

    const [formError, setFormErrors] = useState({
        error: false,
        messages: []
    });

    const handlePasswordInput = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmedPasswordInput = (e) => {
        setConfirmedPassword(e.target.value);
    };

    const removeAccount = async (e) => {
        e.preventDefault();
        setFormErrors({error: false});

        //Check if Password/confirmPassword is validated and return proper formErrors
        const isPasswordValid = validPassword(password);
        const isConfirmPasswordValid = confirmPassword(password, confirmedPassword);

        if(!isPasswordValid.validated) {
            setFormErrors({error: true, message: ["Password has incorrect or has invalid input."]});
            setPassword(""); setConfirmedPassword("");
            return;
        } else if(isPasswordValid.validated && !isConfirmPasswordValid.validated) {
            setFormErrors({error: true, message: [isConfirmPasswordValid.error]});
            setPassword(""); setConfirmedPassword("");
            return;
        }

        //Make request to remove 
        let deleteUserRequest = await axios.post("http://localhost:8080/account/delete", {
            password
        });
        //Get payload from request 
        deleteUserRequest = deleteUserRequest.data;
        
        //Check if returned null or error
        if(deleteUserRequest.error || deleteUserRequest === null) {
            const error = !deleteUserRequest ? ["Internal Server Error."] : deleteUserRequest.message
            setFormErrors({error: true, message: [deleteUserRequest.message]});
            setPassword(""); setConfirmedPassword("");
            return;
        };

        //Check if the DB function returned false ( not removed )
        if(deleteUserRequest === false) {
            setFormErrors({error: true, message: ["Error. User not removed! Please try again or contact an admin."]});
            setPassword(""); setConfirmedPassword("");
            return;
        };

        sessionStatus(dispatch);
        history.push("/");
    };

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