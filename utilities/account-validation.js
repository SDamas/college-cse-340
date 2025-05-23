const utilities = require(".")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/accountModel")
const validate = {}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registrationRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body("account_email")
    .trim()
    .escape()
    .notEmpty()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs
    .withMessage("A valid email is required."),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),

    // valid email is required and cannot already exist in the database
    body("account_email")
    .trim()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs
    .withMessage("A valid email is required.")
    .custom(async (account_email) => {
      const emailExists = await accountModel.checkExistingEmail(account_email)
      if (emailExists){
        throw new Error("This e-mail has already been used. Please log in or use different email")
      }
    }),
  ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/registration", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

/*  **********************************
  *  Login Data Validation Rules
  * ********************************* */
validate.loginRules = () => {
  return [
    // valid email is required and must exist in the database
    body("account_email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("A valid email is required.")
    .custom(async (account_email) => {
      const emailExists = await accountModel.checkExistingEmail(account_email)
      console.log(emailExists)
      if (!emailExists){
        throw new Error("The e-mail entered was not found in our records. Please log in using a different email, or sign up")
      }
    }),

    // password is required, must be strong password and exist in the database
    body("account_password")
    .trim()
    .notEmpty()
    .isStrongPassword({
      minLength: 12,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage("Password does not meet requirements.")
  ]
}

/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkLogData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    })
    return
  }
  next()
}

// Enhancement
validate.dealerProfileUpdateRules = () => {
  return [
    body("contact")
    .trim()
    .notEmpty()
    .withMessage("Please provide a valid contact."),
 
    body("additional_comments")
    .trim()
    .escape()
  ]
}

// Enhancement
validate.checkDealerProfileData = async (req, res, next) => {
  const { contact, additional_comments } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/dealer-profile", {
      errors,
      title: "Dealer Profile",
      nav,
      contact,
      additional_comments
    })
    return
  }
  next()
}

validate.accountUpdateRules = () => {
  return [
    body("account_firstname")
    .trim()
    .notEmpty()
    .escape()
    .withMessage("Please provide a first name."),

    body("account_lastname")
    .trim()
    .notEmpty()
    .escape()
    .withMessage("Please provide a last name."),

    body("account_email")
    .trim()
    .normalizeEmail()
    .notEmpty()
    .custom(async () => {
      const emailExistsForOtherUser = await accountModel.checkEmailExistsForOtherUser(body("account_id"))
      if (emailExistsForOtherUser){
        throw new Error("The e-mail entered is already in use. Please use a different email.")
      }
    })
    .withMessage("Please provide a valid e-mail.")
  ]
}

validate.checkAccountUpdate = async(req, res, next) => {
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/management", {
      errors,
      title: "Account Management",
      nav,
    })
    return
  }
  next()
}

validate.changePasswordRules = () => {
  return [
    body("account_password")
    .trim()
    .notEmpty()
    .isStrongPassword({
      minLength: 12,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage("Password does not meet the minimum requirements.")
  ]
}

validate.checkChangePassword = async(req, res, next) => {
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/management", {
      errors,
      title: "Account Management",
      nav,
    })
    return
  }
  next()
}

module.exports = validate