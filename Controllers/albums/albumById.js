const Album = require("../../Schema/Album");

const findAlbumById = async (req, res) => {
  const albumId = req.albumId;
  try {
    const album = await Album.findById(albumId);

    if (!album) {
      return res.status("400").json({
        error: "Album not found",
      });
    }
    res.json(album);
  } catch (error) {
    console.error(error);
    return res.status("400").json({
      error: "Could not retrieve user",
    });
  }
};

module.exports = findAlbumById;
