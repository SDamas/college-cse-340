const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const accValidate = require('../utilities/account-validation')

router.get("/login", utilities.handleErrors(accountController.buildLogin))
// Build the registration view
router.get("/registration", utilities.handleErrors(accountController.buildRegistration))
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
  utilities.handleErrors(accountController.loginAccount)
)

module.exports = router;