const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  const classifications = await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
  return classifications.rows
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

async function getVehicleById(vehicle_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory
      WHERE inv_id = $1`,
      [vehicle_id]
    )

    return data.rows[0]
  } catch (error) {
    console.error("getVehicleById error" + error)
  }
}

async function checkExistingClassification(classification_name) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.classification
        WHERE classification_name = $1
      `,
      [classification_name]
    )

    return data.rowCount
  } catch (error) {
    console.log("checkExistingClassification Error: " + error)
  }
}

async function addClassification(classification_name) {
  try {
    const data = await pool.query(
      `INSERT INTO public.classification (classification_name)
      VALUES($1)`,
      [classification_name]
    )

    return data.rowCount
  } catch (error) {
    console.error("addClassification error" + error)
  }
}

async function addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
  try {
    const data = await pool.query(
      `INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `,
      [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id]
    )

    return data.rowCount
  } catch (error) {
    console.log("addInventory Error: " + error )
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById, addClassification, addInventory, checkExistingClassification}