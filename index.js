// imports
const express = require("express");
require("dotenv").config();
const notFound = require("./middleware/not-found");
const errorHandling = require("./middleware/error-handling");

// variables and routes
const app = express();
const port = process.env.PORT || 5001;
const userRoutes = require("./routes/userRoutes");
const itemRoutes = require("./routes/itemRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const mealPlanRoutes = require("./routes/mealPlanRoutes");

// extra security
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(xss());

app.use("/api/user/", userRoutes);
app.use("/api/items/", itemRoutes);
app.use("/api/recipies/", recipeRoutes);
app.use("/api/meals/", mealPlanRoutes);

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  })
);
app.use(errorHandling);
app.use(notFound);

// app.get("/api/", function (req, res) {
//   res.send("Welcome to PantryPal");
// });

async function start() {
  try {
    await require("./db/dbConfig");
    app.listen(port, () => console.log(`http://localhost:${port}/api/`));
  } catch (err) {
    console.log(err.message);
  }
}

start();
