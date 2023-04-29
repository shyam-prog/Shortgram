const { use } = require("passport");
const Album = require("../../Schema/Album");

const albumParam = async (req, res, next, id) => {
  try {
    let album = await Album.findById(id)
      .populate("followers", "_id name image")
      .populate("privilegedUsers", "_id name image")
      .exec();

    if (!album) {
      return res.status("400").json({
        error: "album not found",
      });
    }
    res.json(album);
    next();
  } catch (err) {
    return res.status("400").json({
      error: "Could not retrieve album",
    });
  }
};

module.exports = albumParam;
