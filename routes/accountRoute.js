const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const accValidate = require('../utilities/account-validation')

router.get("/login", utilities.handleErrors(accountController.buildLogin))
// Build the registration view
router.get("/registration", utilities.handleErrors(accountController.buildRegistration))
// Account management
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))

// Process the registration data
router.post(
  "/registration",
  accValidate.registrationRules(),
  accValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)
// Process the login attempt
router.post(
  "/login",
  accValidate.loginRules(),
  accValidate.checkLogData,
  utilities.handleErrors(accountController.accountLogin)
)

module.exports = router;