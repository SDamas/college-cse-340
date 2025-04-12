// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const managementValidate = require("../utilities/management-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:vehicleId", utilities.handleErrors(invController.buildByVehicleId));
router.get("/management", utilities.handleErrors(invController.buildManagement));
router.get("/error", utilities.handleErrors(invController.build500Error));
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))

router.post(
  "/add-classification", 
  managementValidate.classificationRules(), 
  managementValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification));
router.post(
  "/add-inventory", 
  managementValidate.inventoryRules(),
  managementValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory));

module.exports = router;