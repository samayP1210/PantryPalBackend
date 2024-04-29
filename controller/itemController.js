const { StatusCodes } = require("http-status-codes");
const Item = require("../db/Items");

function sameExpiryDate(pantryItemDate, alreadyPantryItemDate) {
  if (
    new Date(pantryItemDate).getDate() !==
      new Date(alreadyPantryItemDate).getDate() ||
    new Date(pantryItemDate).getDay() !==
      new Date(alreadyPantryItemDate).getDay() ||
    new Date(pantryItemDate).getFullYear() !==
      new Date(alreadyPantryItemDate).getFullYear()
  )
    return false;
  return true;
}

// add item from shopping list to pantry list
const addItemToPantry = async (req, res, next) => {
  const { itemId } = req.params;

  try {
    const pantryItem = await Item.findOne({ _id: itemId });
    if (!pantryItem) throw new Error("No such item found");

    const alreadyPantryItem = await Item.findOne({
      name: pantryItem.name,
      itemType: "Pantry",
    });

    if (
      alreadyPantryItem &&
      sameExpiryDate(pantryItem.expiryDate, alreadyPantryItem.expiryDate)
    ) {
      alreadyPantryItem.quantity += pantryItem.quantity;
      alreadyPantryItem.expiryDate = new Date(
        Math.max(alreadyPantryItem.expiryDate, pantryItem.expiryDate)
      );
      await Item.findOneAndDelete({ _id: itemId });
      alreadyPantryItem.save();
      res
        .status(StatusCodes.CREATED)
        .json({ status: "success", item: alreadyPantryItem });
    } else {
      pantryItem.itemType = "Pantry";
      pantryItem.save();
      res
        .status(StatusCodes.CREATED)
        .json({ status: "success", item: pantryItem });
    }
  } catch (Err) {
    next(Err);
  }
};

// add new item directly or add expired pantry items to shopping list
const addItemToShopping = async (req, res, next) => {
  const { userId } = req.user;
  const { name, quantity, unit, expiryDate, category } = req.body;
  try {
    if (!name) throw new Error("Enter Pantry Item Name.");
    else if (!quantity) throw new Error("Enter Pantry Item Quantity.");
    else if (!unit) throw new Error("Enter Pantry Item Unit.");
    else if (!category) throw new Error("Enter Pantry Item Catefory.");

    const shoppingItem = await Item.create({
      name,
      quantity,
      unit,
      expiryDate,
      category,
      userId,
    });
    res.status(StatusCodes.CREATED).json({ status: "success", shoppingItem });
  } catch (Err) {
    next(Err);
  }
};

const getAllShoppingItems = async (req, res, next) => {
  const { userId } = req.user;
  try {
    const shoppingItems = await Item.find({ itemType: "Shopping", userId });
    res
      .status(StatusCodes.OK)
      .json({ status: "success", count: shoppingItems.length, shoppingItems });
  } catch (err) {
    next(err);
  }
};

const getAllPantryItems = async (req, res, next) => {
  const { userId } = req.user;
  try {
    const pantryItems = await Item.find({ itemType: "Pantry", userId });
    res
      .status(StatusCodes.OK)
      .json({ status: "success", count: pantryItems.length, pantryItems });
  } catch (err) {
    next(err);
  }
};

const removeItem = async (req, res, next) => {
  const { _id } = req.params;
  try {
    const pantryItem = await Item.findOneAndDelete({ _id });
    if (!pantryItem) return next(new Error("Cannot Find Item."));

    res.status(StatusCodes.OK).json({
      status: "success",
      msg: `${pantryItem.name} removed from pantry items.`,
    });
  } catch (err) {
    next(err);
  }
};

const getExpiredPantryItems = async (req, res, next) => {
  const currentDate = new Date();
  try {
    const expiredItems = await Item.find({
      expiryDate: { $lt: currentDate },
    });

    await Item.deleteMany({
      expiryDate: { $lt: currentDate },
    });

    res
      .status(StatusCodes.OK)
      .json({ status: "success", count: expiredItems.length, expiredItems });
  } catch (err) {
    next(err);
  }
};

const getPantryItemByName = async (req, res, next) => {
  try {
    const { name: query } = req.params;
    const { partial } = req.body;
    const { userId } = req.user;

    var pantryItems;
    if (partial) {
      pantryItems = await Item.find({
        userId,
        $or: [
          {
            name: { $regex: query, $options: "i" },
          },
        ],
        itemType : 'Pantry'
      });
    } else {
      pantryItems = await Item.find({ name: query, userId, itemType : 'Pantry' });
    }

    res
      .status(StatusCodes.OK)
      .json({ status: "success", count: pantryItems.length, pantryItems });
  } catch (Err) {
    next(Err);
  }
};

const updateItem = async (req, res, next) => {
  const { itemId, quantity } = req.params;

  try {
    const item = await Item.findOne({ _id: itemId });
    if (!item) throw new Error("Cannot Find Item");

    if (item.quantity > quantity) {
      item.quantity -= quantity;
      item.save();
    } else if (item.quantity == quantity)
      await Item.findOneAndDelete({ _id: itemId });
    else throw new Error("Cannot Fulfill requirement for " + item.name);

    res.status(StatusCodes.OK).json({ status: "success", item });
  } catch (err) {
    next(err);
  }
};

//buy shopping list items

module.exports = {
  addItemToPantry,
  addItemToShopping,
  removeItem,
  getExpiredPantryItems,
  getAllPantryItems,
  getAllShoppingItems,
  getPantryItemByName,
  updateItem,
};
