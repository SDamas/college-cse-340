const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Get account
* *************************** */
async function getAccount(account_email, account_password){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1 AND account_password = $2"
    const account = await pool.query(sql, [account_email, account_password])
    return account.rowCount
  } catch (error) {
    return error.message
  }
}

// Get account by id
async function getAccountById(account_id){
  try {
    const sql = 'SELECT account_firstname, account_lastname, account_email, account_id FROM public.account WHERE account_id = $1'
    const account = await pool.query(sql, [account_id])
    return account.rows[0]
  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

// Check if there is another user using the e-mail
async function checkEmailExistsForOtherUser(account_email, account_id) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1 AND account_id != $2"
    const email = await pool.query(sql, [account_email, account_id])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM public.account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

// Update account
async function updateAccount(account_id, account_firstname, account_lastname, account_email) {
  try {
    const data = await pool.query(
      `
      UPDATE public.account
      SET account_firstname = $1, account_lastname = $2, account_email = $3
      WHERE account_id = $4
      `,
      [account_firstname, account_lastname, account_email, account_id]
    )

    return data.rowCount
    
  } catch(error) {
    console.log("updateAccount Error: " + error)
  }
}

// Update password
async function updatePassword(account_id, account_password) {
  try {
    const data = await pool.query(
      `
      UPDATE public.account
      SET account_password = $1
      WHERE account_id = $2
      `, [account_password, account_id]
    )

    return data.rowCount

  } catch(error) {
    console.log("updatePassword Error: " + error)
  }
}

module.exports = { registerAccount, checkExistingEmail, checkEmailExistsForOtherUser, getAccount, getAccountByEmail, getAccountById, updateAccount, updatePassword }