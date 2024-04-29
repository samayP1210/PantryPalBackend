const MealPlans = require("../db/MealPlans");
const { StatusCodes } = require("http-status-codes");
const { scheduleEmail } = require("../utils");

const addMealPlan = async (req, res, next) => {
  const { userId, username, email } = req.user;
  var { recipyId, status, date, notifyMe, recipyName } = req.body;

  try {
    if (!recipyId) throw new Error("Enter Recipe Id");
    else if (!status) status = "Pending";
    else if (!date) date = new Date().setHours(new Date().getHours() + 1);

    const mealPlan = await MealPlans.create({
      userId,
      recipyId,
      status,
      date,
    });

    // console.log("->", new Date(date));

    if (notifyMe) {
      scheduleEmail(email, new Date(date), recipyName);
    }

    res.status(StatusCodes.CREATED).json({ status: "success", mealPlan });
  } catch (err) {
    next(err);
  }
};

const getMealPlans = async (req, res, next) => {
  const { userId } = req.user;
  try {
    const mealPlans = await MealPlans.find({ userId }).sort("date");

    res
      .status(StatusCodes.OK)
      .send({ status: "success", count: mealPlans.length, mealPlans });
  } catch (err) {
    next(err);
  }
};

const getPendingMealPlans = async (req, res, next) => {
  const { userId } = req.user;
  try {
    const mealPlans = await MealPlans.find({
      userId,
      status: "Pending",
    }).sort("date");

    res
      .status(StatusCodes.OK)
      .send({ status: "success", count: mealPlans.length, mealPlans });
  } catch (err) {
    next(err);
  }
};

const getOtherMealPlans = async (req, res, next) => {
  const { userId } = req.user;
  try {
    const mealPlans = await MealPlans.find({
      userId,
      status: { $ne: "Pending" },
    }).sort("-date");

    res
      .status(StatusCodes.OK)
      .send({ status: "success", count: mealPlans.length, mealPlans });
  } catch (err) {
    next(err);
  }
};

const deleteMealPlan = async (req, res, next) => {
  const { userId } = req.user;
  const { _id } = req.params;

  try {
    if (!_id) throw new Error("Enter Recipe Id");
    const mealPlan = await MealPlans.findOneAndDelete({ userId, _id });

    if (!mealPlan) throw new Error("No Plan found");

    res.status(StatusCodes.OK).send({ status: "success", mealPlan });
  } catch (err) {
    next(err);
  }
};

const updateMealPlans = async (req, res, next) => {
  const { _id } = req.params;
  const { status } = req.body;

  try {
    const mealPlan = await MealPlans.findOne({ _id });
    mealPlan.status = status;
    mealPlan.save();

    res.status(StatusCodes.OK).send({ status: "success", mealPlan });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addMealPlan,
  deleteMealPlan,
  getPendingMealPlans,
  getOtherMealPlans,
  getMealPlans,
  updateMealPlans,
};
