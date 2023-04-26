const Album = require("../../Schema/Album");

const removeFollower = async (req, res, next) => {
  try {
    let r = await Album.findByIdAndUpdate(req.body.unfollowId, {
      $pull: { followers: req.body.userId },
    })
      .populate("followers", "_id name")
      .exec();

    res.json(r);
    next();
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

module.exports = removeFollower;
