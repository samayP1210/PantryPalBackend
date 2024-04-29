const errorHandling = (err, req, res, next) => {
  res.status(500).json({ status: "failed", msg: err.message });
};

module.exports = errorHandling;