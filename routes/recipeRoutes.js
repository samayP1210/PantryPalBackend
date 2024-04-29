const express = require("express");
const router = express.Router();
require("dotenv").config();

const {
  addRecipe,
  removeRecipe,
  getAllRecipies,
  getSingleRecipe,
  getFeaturedRecipies,
  getSearchRecipies,isSufficientIngredients
} = require("../controller/recipeController");
const authenticateUser = require("../middleware/authentication");
const { StatusCodes } = require("http-status-codes");

router
  .route("/")
  .post(authenticateUser, addRecipe)
  .get(authenticateUser, getAllRecipies);

router.route("/featured").get(authenticateUser, getFeaturedRecipies);
router.route("/search-recipe/:query").get(authenticateUser, getSearchRecipies);

router
  .route("/:recipeId")
  .delete(authenticateUser, removeRecipe)
  .get(authenticateUser, getSingleRecipe);

module.exports = router;
