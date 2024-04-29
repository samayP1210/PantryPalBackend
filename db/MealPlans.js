const mongoose = require("mongoose");

const MealPlanSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  recipyId: {
    type: mongoose.Types.ObjectId,
    ref: "Recipies",
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: new Date().setHours(new Date().getHours() + 1),
  },
  status: {
    type: "String",
    required: true,
    enum: ["Pending", "Completed", "Missed"],
    default: "Pending",
  },
});

module.exports = mongoose.model("MealPlans", MealPlanSchema);
