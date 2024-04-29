const mongoose = require("mongoose");
require('dotenv').config()

const defaultExpirationDate = () => {
  var someDate = new Date();
  var numberOfDaysToAdd = 2;
  var result = someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
  return result;
};

const ItemSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "Users",
    required: [true],
  },
  name: {
    type: "String",
    required: [true, "Enter item Name."],
  },
  quantity: {
    type: Number,
    required: [true, "Enter item quantity."],
  },
  unit: {
    type: "String",
    required: [true, "Enter item unit."],
  },
  purchaseDate: {
    type: Date,
    default: new Date(),
  },
  expiryDate: {
    type: Date,
    default: defaultExpirationDate(),
    required: [true, "Enter item expiration date."],
  },
  category: {
    type: "String",
    enum: ["Sauces", "Veggies", "Fruits", "Dairy", "Meat", "Spices", "Other"],
    // []
    required: [true, "Enter item category."],
  },
  itemType: {
    type: String,
    required: [true],
    default: "Shopping",
    enum: ["Shopping", "Pantry"],
  },
  imageUrl: {
    type: String,
    default:
      `https://res.cloudinary.com/${process.env.CLOUD_NAME}/image/upload/v1713699479/PantryPal/defaultIngredient.jpg`
  },
});

ItemSchema.pre("save", async function (next) {
  const userName = this.name;
  this.name =
    userName.slice(0, 1).toUpperCase() + userName.slice(1).toLowerCase();
});

module.exports = mongoose.model("Items", ItemSchema);
