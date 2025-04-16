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
  const classificationList = await utilities.buildClassificationList()
  res.render("inventory/management", {
    title: `Management`,
    nav,
    classificationList,
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
  let classificationList = await utilities.buildClassificationList()
  const { classification_name } = req.body
  
  const classificationAdded = await invModel.addClassification(classification_name)

  if (classificationAdded) {
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
      classificationList
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
  const classificationList = await utilities.buildClassificationList()

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
      classificationList,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, it was not possible to add this inventory. Please try again")
    res.status(501).render("inventory/management", {
      title: "Management",
      nav,
      errors,
      classificationList
    })
  }
}


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getVehicleById(inv_id)
  const classificationList = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationList,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}


/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/management")
  } else {
    const classificationList = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}


invCont.buildDeleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.params.inv_id)
  const inventory = await invModel.getVehicleById(inv_id)
  const inv_make = inventory.inv_make
  const inv_model = inventory.inv_model
  const inv_year = inventory.inv_year
  const inv_price = inventory.inv_price
  res.render("inventory/delete-inventory", {
    title: "Delete Inventory",
    nav,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
  })
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  let { inv_id } = req.body
  inv_id = parseInt(inv_id)
  const { inv_make, inv_model } = req.body
  const deleteResult = await invModel.deleteInventory(
    inv_id,  
  )

  if (deleteResult) {
    const itemName = deleteResult.inv_make + " " + deleteResult.inv_model
    req.flash("notice", `The ${itemName} was successfully deleted.`)
    res.status(200).render("inventory/management", {
      title: "Management",
      nav,
      classificationList,
      errors: null
    })
  } else {
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the deletion failed.")
    res.status(501).render("inventory/delete-inventory", {
    title: "Edit " + itemName,
    nav,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    })
  }
}


invCont.build500Error = async function (req, res, next) {
  const error = new Error('Intentional 500 error from the server');
  error.status = 500;
  next(error);
}

module.exports = invCont