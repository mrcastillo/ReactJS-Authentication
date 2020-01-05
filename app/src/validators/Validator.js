import validator from "validator";
import _ from "lodash";

const emailWhitelist = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0123456789-_.@+";

export const isEmail = (userSubmittedEmail) => {
    //Check if email isnt empty 
    const isEmailEmpty = {
        valid: !validator.isEmpty(userSubmittedEmail),
        error: "Email field cannot be empty."
    }
    
    //Check if email is a valid email
    const isEmailEmail =  {
        valid: validator.isEmail(userSubmittedEmail),
        error: "Please enter a valid email address. "
    }

    //Check if email has correct characters from emailWhitelist
    const isEmailWhitelisted = {
        valid: validator.isWhitelisted(userSubmittedEmail, emailWhitelist),
        error: "Only [a-Z][0-9] - _ . are allowed"
    }

    //Create an array with all our validator objects.
    const validatorsArray = [isEmailEmpty, isEmailEmail, isEmailWhitelisted];
    //Create another array to store our error messages
    const emailValidationErrors = [];

    //Check each validator object to see if they are valid, and push the error msg
    _.each(validatorsArray, (check) => {
        if(!check.valid){
            emailValidationErrors.push(check.error);
        };
    });
    
    //Create an object to return, checks if all fields passed, returns true and empty array for no errors
    const emailValidation = {
        validated: emailValidationErrors.length > 0 ? false : true,
        errors: emailValidationErrors
    }
    //Return our object
    return emailValidation;
}


//Password
export const validPassword = (userSubmittedPassword) => {
    //Check if password is empty
    const isPasswordEmpty = {
        valid: !validator.isEmpty(userSubmittedPassword),
        error: "Password cannot be empty!"
    }
    
    //Check min / max length of password 8 - 64
    const isPasswordValidLength = {
        valid: validator.isByteLength(userSubmittedPassword, {
            min: 8,
            max: 64
        }),
        error: "Password must be between 8 to 64 characters."
    }
    
    const validatorsArray = [isPasswordEmpty, isPasswordValidLength];

    const passwordValidationErrors = [];

    _.each(validatorsArray, (check) => {
        if(!check.valid){
            passwordValidationErrors.push(check.error);
        }
    });

    const passwordValidation = {
        validated: passwordValidationErrors.length > 0 ? false : true,
        errors: passwordValidationErrors
    };

    return passwordValidation;
    /*
        Add to see if password contains both number and characters
    */
}

export const confirmPassword = (userSubmittedPassword, userSubmittedConfirmPassword) => {
    const doesConfirmPasswordMatch = {
        valid: validator.equals(userSubmittedConfirmPassword, userSubmittedPassword),
        error: "Both passwords must match."
    }

    const validatorsArray = [doesConfirmPasswordMatch];
    const confirmPasswordValidationErrors = [];

    _.each(validatorsArray, (check) => {
        if(!check.valid){
            confirmPasswordValidationErrors.push(check.error);
        }
    });

    const confirmPasswordValidation = {
        validated: confirmPasswordValidationErrors.length > 0 ? false : true,
        errors: confirmPasswordValidationErrors
    }

    return confirmPasswordValidation;
}

export const validatePostComment = (userSubmittedComment) => {

    const isCommentValidLength = {
        valid: !validator.isByteLength(userSubmittedComment, {
            min: 2,
            max: 1000
        }),
        error: "Post comment is either too short or too long."
    };

    const isCommentASCII = {
        valid: validator.isAscii(userSubmittedComment),
        error: "Comment contains invalid characters."
    }
}