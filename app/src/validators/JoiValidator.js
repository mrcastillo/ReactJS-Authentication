import Joi from "@hapi/joi"

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
            errors: ["Email must be a valid format. (e.g 123@abc.com)"]
        }
    } 
    else {
        return {
            validated: true,
            errors: null
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
            errors: ["Password must be 8-64 chars long and contain one uppercase, lowercase, and non-alphanumeric character(ex. ',$%#@!')."]
        }
    }
    else {
        return {
            validated: true,
            errors: null
        }
    }
};

export const confirmPassword = (userSubmittedPassword, userSubmittedRepeatPassword) => {
    const confirmPassword = Joi.object({
        repeatPassword: Joi.string().valid(userSubmittedPassword).min(8).max(64).required()
    });

    const validateRepeatPassword = confirmPassword.validate({
        repeatPassword: userSubmittedRepeatPassword
    });

    if(validateRepeatPassword.error) {
        return {
            validated: false,
            errors: ["Passwords do not match."]
        }
    }
    else {
        return {
            validated: true,
            errors: null
        }
    }
}