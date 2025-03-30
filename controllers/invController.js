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
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildByVehicleId = async function (req, res, next) {
  const vehicle_id = req.params.vehicleId
  const data = await invModel.getVehicleById(vehicle_id)
  const details = await utilities.buildVechicleDetails(data)
  let nav = await utilities.getNav()
  const vehicleName = data.inv_model
  res.render("./inventory/vehicle", {
    title: `${data.inv_make} ${data.inv_model}`,
    nav,
    details
  })
}

invCont.build500Error = async function (req, res, next) {
  const error = new Error('Intentional 500 error from the server');
  error.status = 500;
  next(error);
}

module.exports = invCont