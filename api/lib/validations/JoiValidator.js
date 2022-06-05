"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validPassword = exports.isEmail = exports.hasUppercase = exports.hasNumeric = exports.hasNonAlphanumeric = exports.hasLowercase = exports.confirmPassword = exports.alphanumericUsername = void 0;

var _joi = _interopRequireDefault(require("@hapi/joi"));

var hasNumeric = _joi["default"].string().pattern(/[0-9]/);

exports.hasNumeric = hasNumeric;

var hasUppercase = _joi["default"].string().pattern(/[A-Z]/);

exports.hasUppercase = hasUppercase;

var hasLowercase = _joi["default"].string().pattern(/[a-z]/);

exports.hasLowercase = hasLowercase;

var hasNonAlphanumeric = _joi["default"].string().pattern(/[^a-zA-Z\d\s]/);

exports.hasNonAlphanumeric = hasNonAlphanumeric;

var isEmail = function isEmail(userSubmittedEmail) {
  //Create the schema to validate the userSubmittedEmail.
  var emailSchema = _joi["default"].object({
    userEmail: _joi["default"].string().email({
      minDomainSegments: 2,
      tlds: {
        allow: ['com', 'net']
      }
    }).required()
  });

  var isEmailValid = emailSchema.validate({
    userEmail: userSubmittedEmail
  });

  if (isEmailValid.error) {
    return {
      validated: false,
      error: "Email must be a valid format. (e.g 123@abc.com)"
    };
  } else {
    return {
      validated: true,
      error: null
    };
  }
};

exports.isEmail = isEmail;

var validPassword = function validPassword(userSubmittedPassword) {
  //Check if password has a nonAlphanumeric number.
  //Provide Validation Schema
  var passwordValidationSchema = _joi["default"].object({
    matchUppercase: _joi["default"].string().pattern(/[A-Z]/).min(8).max(64).required(),
    //Matchs Uppercase characters regex
    matchLowercase: _joi["default"].string().pattern(/[a-z]/).min(8).max(64).required(),
    //Matchs Lowercase characters regex
    matchNumeric: _joi["default"].string().pattern(/[0-9]/).min(8).max(64).required(),
    //Matchs numeric characters regex
    matchNonAlphanumeric: _joi["default"].string().pattern(/[^a-zA-Z\d\s]/).min(8).max(64).required() //Matchs NonAlphanumeric characters regex

  });

  var isPasswordValid = passwordValidationSchema.validate({
    matchUppercase: userSubmittedPassword,
    matchLowercase: userSubmittedPassword,
    matchNumeric: userSubmittedPassword,
    matchNonAlphanumeric: userSubmittedPassword
  });

  if (isPasswordValid.error) {
    return {
      validated: false,
      error: "Password must be 8-64 chars long and contain one uppercase, lowercase, and non-alphanumeric character(ex. ',$%#@!')."
    };
  } else {
    return {
      validated: true,
      error: null
    };
  }
};

exports.validPassword = validPassword;

var confirmPassword = function confirmPassword(userSubmittedPassword, userSubmittedRepeatPassword) {
  var confirmSchema = _joi["default"].object({
    validRepeatPassword: _joi["default"].string().valid(userSubmittedPassword).min(8).max(64).required()
  });

  var passwordMatch = confirmSchema.validate({
    validRepeatPassword: userSubmittedRepeatPassword
  });

  if (passwordMatch.error) {
    return {
      validated: false,
      error: "Passwords do not match."
    };
  } else {
    return {
      validated: true,
      error: null
    };
  }
};

exports.confirmPassword = confirmPassword;

var alphanumericUsername = function alphanumericUsername(userSubmittedUsername) {
  var usernameSchema = _joi["default"].object({
    validUsername: _joi["default"].string().alphanum()
  });

  var validUsername = usernameSchema.validate({
    validUsername: userSubmittedUsername
  });

  if (validUsername.error) {
    return {
      validated: false,
      error: "Username can only contain a minimum of 3 and maximum of 16 letters and numbers."
    };
  } else {
    return {
      validated: true,
      error: null
    };
  }
};

exports.alphanumericUsername = alphanumericUsername;