const jwt = require("jsonwebtoken")
require("dotenv").config()
const utilities = require("../utilities")
const accountModel = require("../models/accountModel")
const bcrypt = require("bcryptjs")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegistration(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/registration", {
    title: "Registration",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  console.log(regResult)

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/registration", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
*  Process Login
* *************************************** */
async function loginAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body

  const logResult = await accountModel.getAccount(
    account_email,
    account_password
  )
  console.log(logResult)

  if (logResult) {
    req.flash(
      "notice",
      `Logged successfully.`
    )
    res.status(201).render("index", {
      title: "Home",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the login failed.")
    res.status(501).render("account/login", {
      title: "Login",
      nav,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  console.log(accountData)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

async function buildAccountManagement(req, res, next) {
  const nav = await utilities.getNav();
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
  }
  )
}

// Process logout
async function logoutUser(req, res, next) {
  const nav = await utilities.getNav()
  res.clearCookie("jwt")
  res.status(200).render("index", {
    title: "Home",
    nav,
  })
}

// Render update view
async function updateView(req, res, next) {
  const nav = await utilities.getNav()
  const accountData = await accountModel.getAccountById(res.locals.accountData.account_id)
  console.log(accountData)
  res.render(`account/update`, {
    title: "Update Account Information",
    nav,
    errors: null,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_id: accountData.account_id
  })
}

// Process account update
async function updateAccount(req, res, next) {
  const nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body

  const accountUpdated = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email)

  if (accountUpdated) {
    req.flash("notice", "Account information updated successfully")
    res.status(200).render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
      account_email,
    })
  } else {
    req.flash("notice", "Sorry, it was not possible to update your account information")
    res.status(500).render("account/update", {
      title: "Update Account Information",
      nav,
      errors,
    })
  }

}

// Process password change
async function updatePassword(req, res, next) {
  const nav = await utilities.getNav()
  const { account_password, account_id } = req.body
  // Has password
  let hashPassword = bcrypt.hashSync(account_password, 10)
  const passwordUpdated = await accountModel.updatePassword(parseInt(account_id), hashPassword)

  if (passwordUpdated) {
    req.flash("notice", "Password updated successfully")
    res.status(200).render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, it was not possible to update your password")
    res.status(500).render("account/update", {
      title: "Update Account Information",
      nav,
      errors
    })
  }
}

module.exports = { buildLogin, buildRegistration, registerAccount, loginAccount, accountLogin, logoutUser, buildAccountManagement, updateView, updateAccount, updatePassword }