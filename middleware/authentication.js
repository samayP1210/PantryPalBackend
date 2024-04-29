const jwt = require("jsonwebtoken");
const {StatusCodes} = require('http-status-codes')

const authenticateUser = async (req, res, next) => {
  try {
    const autherization = req.headers.authorization;
    if (!autherization || !autherization.startsWith("Bearer ")) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Unautherized access.." });
    }
    const user = jwt.verify(
      autherization.split(" ")[1],
      process.env.JWT_SECREt_KEY
    );
    // console.log(user)
    if (Date.now() >= user.exp * 1000) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ status: "Login again" });
    } else {
      req.user = user;
    }
  } catch (err) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: err.message });
  }
  next();
};

module.exports = authenticateUser;
