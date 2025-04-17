const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const accValidate = require('../utilities/account-validation')

router.get("/login", utilities.handleErrors(accountController.buildLogin))
// Build the registration view
router.get("/registration", utilities.handleErrors(accountController.buildRegistration))
// Dealer Profile: enhancement
router.get("/dealer-profile", utilities.checkJWTToken, utilities.handleErrors(accountController.buildDealerProfile))
// Account management
router.get("/", utilities.checkJWTToken, utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))
// Update account
router.get("/update", utilities.checkLogin, utilities.checkJWTToken, utilities.handleErrors(accountController.updateView))
// Logout user
router.get("/logout", utilities.checkJWTToken, utilities.handleErrors(accountController.logoutUser))

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

// Enhancement
// Process dealer profile update
router.post(
  "/dealer-profile",
  utilities.checkAccountType,
  accValidate.dealerProfileUpdateRules(),
  accValidate.checkDealerProfileData,
  utilities.checkJWTToken,
  utilities.handleErrors(accountController.updateDealerProfile)
)

// Process account update
router.post(
  "/update",
  utilities.checkAccountType,
  accValidate.accountUpdateRules(),
  accValidate.checkAccountUpdate,
  utilities.handleErrors(accountController.updateAccount),
)

router.post(
  "/update/password",
  utilities.checkAccountType,
  accValidate.changePasswordRules(),
  accValidate.checkChangePassword,
  utilities.handleErrors(accountController.updatePassword)
)

module.exports = router;