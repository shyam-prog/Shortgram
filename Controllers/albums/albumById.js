const Album = require("../../Schema/Album");

const findAlbumById = async (req, res) => {
  const albumId = req.params.albumId;
  try {
    const album = await Album.findById(albumId)
      .populate("followers", "_id name image")
      .populate("privilegedUsers", "_id name image")
      .exec();

    if (!album) {
      return res.status("400").json({
        error: "album not found",
      });
    }
    res.json(album);
    // next();
  } catch (err) {
    return res.status("400").json({
      error: "Could not retrieve album",
    });
  }
};

module.exports = findAlbumById;
