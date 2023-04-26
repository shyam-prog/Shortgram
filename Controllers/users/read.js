const User = require("../../Schema/User");

const read = (req, res, next) => {
  console.log(req.profile, "here");
  res.json(req.profile);
};

module.exports = read;
