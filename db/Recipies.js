const mongoose = require("mongoose");
require('dotenv').config()

const RecipeSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
  },
  recipyName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    minlength: 40,
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  imageUrl :{
    type : String,
    default : 'https://res.cloudinary.com/dal2dlywm/image/upload/v1713700376/PantryPal/defaultRecipe.jpg'
  },
  cuisine: {
    type: String,
    required : true
  },
  servings: {
    type: Number,
    required: true,
  },
  ingredients: {
    type: [{name : String, quantity : Number, unit : String}],
    required: true,
  },
  featured : {
    type : Boolean,
    default : false
  }
});

module.exports = mongoose.model('Recipies', RecipeSchema)