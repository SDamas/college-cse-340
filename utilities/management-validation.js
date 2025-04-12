const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventoryModel")
const validate = {}

/*  **********************************
  *  Classificaiton Data Validation Rules
  * ********************************* */
validate.classificationRules = () => {
  return [
    // classification_name is required and must be string
    body("classification_name")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("Please provide a classification name.") // on error this message is sent.
    .custom(async (classification_name) => {
      const classificationExists = await invModel.checkExistingClassification(classification_name)
      if (classificationExists){
        throw new Error("This classification has already been added. Please add a different classification")
      }
    }),
  ]
}

/* ******************************
 * Check data and return errors or return to management
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/management", {
      errors,
      title: "Management",
      nav,
      classification_name
    })
    return
  }
  next()
}

/*  **********************************
  *  Inventory Data Validation Rules
  * ********************************* */
validate.inventoryRules = () => {
  return [
    body("inv_make")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("Please provide a make."),

    body("inv_model")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("Please provide a model."),

    body("inv_year")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 4 })
    .withMessage("Please provide a year."),

    body("inv_description")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 2 })
    .withMessage("Please provide a description."),

    body("inv_image")
    .trim()
    .notEmpty()
    .isLength({ min: 2 })
    .withMessage("Please provide a image."),

    body("inv_thumbnail")
    .trim()
    .notEmpty()
    .isLength({ min: 2 })
    .withMessage("Please provide a thumbnail."),

    body("inv_price")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("Please provide a price."),

    body("inv_miles")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("Please provide a miles."),

    body("inv_color")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("Please provide a color."),

    body("classification_id")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("Please provide a classification."),
  ]
}

/*  **********************************
  *  Inventory Data Validation Rules
  * ********************************* */
validate.updateInventoryRules = () => {
  return [
    body("inv_make")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("Please provide a make."),

    body("inv_model")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("Please provide a model."),

    body("inv_year")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 4 })
    .withMessage("Please provide a year."),

    body("inv_description")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 2 })
    .withMessage("Please provide a description."),

    body("inv_image")
    .trim()
    .notEmpty()
    .isLength({ min: 2 })
    .withMessage("Please provide a image."),

    body("inv_thumbnail")
    .trim()
    .notEmpty()
    .isLength({ min: 2 })
    .withMessage("Please provide a thumbnail."),

    body("inv_price")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("Please provide a price."),

    body("inv_miles")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("Please provide a miles."),

    body("inv_color")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("Please provide a color."),

    body("classification_id")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("Please provide a classification."),
  ]
}

/* ******************************
 * Check data and return errors or return to management
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/management", {
      errors,
      title: "Management",
      nav,
      inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id,
    })
    return
  }
  next()
}

/* ******************************
 * Check data and return errors or return to management
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/edit-inventory", {
      errors,
      title: `Edit ${inv_make} ${inv_model}`,
      nav,
      inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id,
    })
    return
  }
  next()
}

module.exports = validate