const invModel = require("../models/inventoryModel")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })
}

invCont.buildByVehicleId = async function (req, res, next) {
  const vehicle_id = req.params.vehicleId
  const data = await invModel.getVehicleById(vehicle_id)
  const details = await utilities.buildVechicleDetails(data)
  let nav = await utilities.getNav()
  res.render("inventory/vehicle", {
    title: `${data.inv_make} ${data.inv_model}`,
    nav,
    details,
    errors: null,
  })
}

invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: `Management`,
    nav,
    errors: null,
  })
}


/* ***************************
 *  Build add classification view
 * ************************** */

invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: `Add Classification`,
    nav,
    errors: null,
  })
}

/* ***************************
 *  Process classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body
  
  const classificationAdded = await invModel.addClassification(classification_name)

  if (classificationAdded) {
    nav = await utilities.getNav()
    req.flash(
      "notice",
      `Classification added successfully`
    )
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, it was not possible to add this classification. Please try again")
    res.status(500).render("inventory/management", {
      title: "Management",
      nav,
      errors,
    })
  }
}


/* ***************************
 *  Build add inventory view
 * ************************** */

invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: `Add Inventory`,
    nav,
    classificationList,
    errors: null,
  })
}

/* ***************************
 *  Process inventory
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id  } = req.body
  
  const inventoryAdded = await invModel.addInventory(
    inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
  )

  if (inventoryAdded) {
    nav = await utilities.getNav()
    req.flash(
      "notice",
      `Inventory added successfully`
    )
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, it was not possible to add this inventory. Please try again")
    res.status(501).render("inventory/management", {
      title: "Management",
      nav,
      errors,
    })
  }
}


invCont.build500Error = async function (req, res, next) {
  const error = new Error('Intentional 500 error from the server');
  error.status = 500;
  next(error);
}

module.exports = invCont