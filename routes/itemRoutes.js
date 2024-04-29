const express = require("express");
const {
  addItemToPantry,
  addItemToShopping,
  removeItem,
  getExpiredPantryItems,
  getAllPantryItems,
  getAllShoppingItems,
  getPantryItemByName,
  updateItem,
} = require("../controller/itemController");
const router = express.Router();
const authenticateUser = require("../middleware/authentication");
const Items = require("../db/Items");

router
  .route("/add-item-to-pantry/:itemId")
  .patch(authenticateUser, addItemToPantry);
router.route("/add-item-to-shopping").post(authenticateUser, addItemToShopping);
router.route("/shopping-items").get(authenticateUser, getAllShoppingItems);
router.route("/pantry-items").get(authenticateUser, getAllPantryItems);
router.route("/pantry-items/:name").post(authenticateUser, getPantryItemByName);
router
  .route("/update-item/:itemId/:quantity")
  .patch(authenticateUser, updateItem);
router.route("/expired-items").get(authenticateUser, getExpiredPantryItems);
router.route("/remove-item/:_id").delete(authenticateUser, removeItem);

module.exports = router;