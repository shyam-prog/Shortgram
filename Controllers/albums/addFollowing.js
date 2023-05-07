const User = require("../../Schema/User");

const addFollowing = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.body.userId, {
      $push: { followedAlbums: req.body.followId },
    })
      .populate("followedAlbums", "_id name image")
      .exec();
    next();
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

module.exports = addFollowing;
