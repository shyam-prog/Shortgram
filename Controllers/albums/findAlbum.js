const Album = require("../../Schema/Album");

const findAlbum = async (req, res) => {
  const name = req.searchNamed;
  try {
    const albums = await Album.find({ name: { $regex: name, $options: "i" } });
    res.json(albums);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

module.exports = findAlbum;
