const express = require("express");
const router = express.Router();
const {
  addMealPlan,
  deleteMealPlan,
  getPendingMealPlans,
  getOtherMealPlans,
  getMealPlans,
  updateMealPlans,
} = require("../controller/mealPlanController");
const autheticateUser = require("../middleware/authentication");

router
  .route("/")
  .post(autheticateUser, addMealPlan)
  .get(autheticateUser, getMealPlans);
router.get("/pending-meals", autheticateUser, getPendingMealPlans);
router.get("/other-meals", autheticateUser, getOtherMealPlans);
router
  .route("/:_id")
  .delete(autheticateUser, deleteMealPlan)
  .patch(autheticateUser, updateMealPlans);

module.exports = router;
