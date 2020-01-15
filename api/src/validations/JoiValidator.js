import Joi from "@hapi/joi"

export const hasNumeric = Joi.string().pattern(/[0-9]/);
export const hasUppercase = Joi.string().pattern(/[A-Z]/);
export const hasLowercase = Joi.string().pattern(/[a-z]/);
export const hasNonAlphanumeric = Joi.string().pattern(/[^a-zA-Z\d\s]/);

export const isEmail = (userSubmittedEmail) => {
    //Create the schema to validate the userSubmittedEmail.
    const emailSchema = Joi.object({
        userEmail: Joi.string().email(
            { minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }
        )
        .required()
    });

    const isEmailValid = emailSchema.validate({
        userEmail: userSubmittedEmail
    });

    if(isEmailValid.error) {
        return {
            validated: false,
            error: "Email must be a valid format. (e.g 123@abc.com)"
        }
    } 
    else {
        return {
            validated: true,
            error: null
        }
    }
};

export const validPassword = (userSubmittedPassword) => {
    //Check if password has a nonAlphanumeric number.

    //Provide Validation Schema
    const passwordValidationSchema = Joi.object({
        matchUppercase: Joi.string().pattern(/[A-Z]/).min(8).max(64).required(), //Matchs Uppercase characters regex
        matchLowercase: Joi.string().pattern(/[a-z]/).min(8).max(64).required(), //Matchs Lowercase characters regex
        matchNumeric: Joi.string().pattern(/[0-9]/).min(8).max(64).required(), //Matchs numeric characters regex
        matchNonAlphanumeric: Joi.string().pattern(/[^a-zA-Z\d\s]/).min(8).max(64).required() //Matchs NonAlphanumeric characters regex
    });
    
    const isPasswordValid = passwordValidationSchema.validate({
        matchUppercase: userSubmittedPassword,
        matchLowercase: userSubmittedPassword,
        matchNumeric: userSubmittedPassword,
        matchNonAlphanumeric: userSubmittedPassword
    });

    if(isPasswordValid.error) {
        return {
            validated: false,
            error: "Password must be 8-64 chars long and contain one uppercase, lowercase, and non-alphanumeric character(ex. ',$%#@!')."
        }
    }
    else {
        return {
            validated: true,
            error: null
        }
    }
};

export const confirmPassword = (userSubmittedPassword, userSubmittedRepeatPassword) => {
    const confirmSchema = Joi.object({
        validRepeatPassword: Joi.string().valid(userSubmittedPassword).min(8).max(64).required()
    })

    const passwordMatch = confirmSchema.validate({
        validRepeatPassword: userSubmittedRepeatPassword
    });

    if(passwordMatch.error) {
        return {
            validated: false,
            error: "Passwords do not match."
        }
    }
    else {
        return {
            validated: true,
            error: null
        }
    }
};

export const alphanumericUsername = (userSubmittedUsername) => {
    const usernameSchema = Joi.object({
        validUsername: Joi.string().alphanum()
    });

    const validUsername = usernameSchema.validate({
        validUsername: userSubmittedUsername
    });

    if(validUsername.error) {
        return {
            validated: false,
            error: "Username can only contain a minimum of 3 and maximum of 16 letters and numbers."
        }
    }
    else {
        return {
            validated: true,
            error: null
        }
    }
};