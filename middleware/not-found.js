const notFound = (req, res) => {
  res.status(404).json({ status: "failed", msg: "Route Not Found" });
};

module.exports = notFound