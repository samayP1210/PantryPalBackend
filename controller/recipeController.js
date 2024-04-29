const { StatusCodes } = require("http-status-codes");
const Recipies = require("../db/Recipies");
const Item = require("../db/Items");
const Meal = require("../db/MealPlans");

const addRecipe = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const {
      recipyName,
      description,
      instructions,
      ingredients,
      servings,
      cuisine,
      imageUrl,
    } = req.body;

    var featured = false;
    if (req.body.hasOwnProperty("featured")) featured = req.body.featured;

    if (!recipyName) throw new Error("Enter Recipe Name");
    if (!cuisine) throw new Error("Enter Recipe Cuisine");
    if (ingredients.length == 0) throw Error("Enter Recipe Ingredients");
    if (!description) throw new Error("Enter Recipe Description");
    if (description.length < 40)
      throw new Error("Description length Should be more than 40 words");
    if (!instructions) throw new Error("Enter Recipe Instructions");

    const recipe = await Recipies.create({
      recipyName,
      description,
      instructions,
      ingredients,
      servings,
      cuisine,
      userId,
      featured,
    });

    if (imageUrl) {
      recipe.imageUrl = imageUrl;
      recipe.save();
    }
    res.status(StatusCodes.CREATED).json({ status: "success", recipe });
  } catch (Err) {
    next(Err);
  }
};

const removeRecipe = async (req, res, next) => {
  try {
    const { recipeId } = req.params;

    const recipe = await Recipies.findOneAndDelete({ _id: recipeId });
    if (!recipe) throw new Error("Cannot Find recipe with id: " + recipeId);

    await Meal.deleteMany({recipyId : recipeId})
    res.status(StatusCodes.OK).json({ status: "success", recipe });
  } catch (Err) {
    next(Err);
  }
};

const getAllRecipies = async (req, res, next) => {
  try {
    var recipies = await Recipies.find();

    res.status(StatusCodes.OK).json({
      status: "success",
      count: recipies.length,
      recipies,
    });
  } catch (Err) {
    next(Err);
  }
};

const isSufficientIngredients = async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    var recipe = await Recipies.findOne({ _id: recipeId });
    var sufficientIngredients = recipe.ingredients.map(async (ingredient) => {
      const pantryQuantity = await Item.findOne({
        name: ingredient.name,
        itemType: "Pantry",
      }).select("quantity");

      // console.log(ingredient.name, ingredient.quantity, pantryQuantity);
      if (!pantryQuantity || pantryQuantity < ingredient.quantity) {
        sufficientIngredients = false;
        return false;
      }
      return true;
    });

    res
      .status(StatusCodes.OK)
      .json({ status: "success", sufficientIngredients });
  } catch (err) {
    next(res);
  }
};

const getSingleRecipe = async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    const recipe = await Recipies.findOne({ _id: recipeId });

    if (!recipe) throw new Error("Cannot find recipe with id: " + recipeId);

    res.status(StatusCodes.OK).json({ status: "success", recipe });
  } catch (err) {
    next(err);
  }
};

const getFeaturedRecipies = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const featuredRecipies = await Recipies.find({ featured: true, userId });
    res
      .status(StatusCodes.OK)
      .json({ status: "success", recipies: featuredRecipies });
  } catch (err) {
    next(err);
  }
};

const getSearchRecipies = async (req, res, next) => {
  try {
    const { query } = req.params;

    const recipies = await Recipies.find({
      $or: [
        {
          recipyName: { $regex: query, $options: "i" },
        },
        {
          cuisine: { $regex: query, $options: "i" },
        },
      ],
    });

    res
      .status(StatusCodes.OK)
      .json({ status: "success", count: recipies.length, recipies });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addRecipe,
  removeRecipe,
  getAllRecipies,
  getSingleRecipe,
  getFeaturedRecipies,
  getSearchRecipies,
  isSufficientIngredients,
};
