const Album = require("../../Schema/Album");
const User = require("../../Schema/User");

const addPrivilegedUser = async (req, res) => {
  const { albumId, userId } = req.body;
  try {
    const album = await Album.findById(albumId);
    if (!album) {
      res.status(404).json({ message: "No album find" });
      return;
    }

    if (!album.privilegedUsers.includes(userId)) {
      album.privilegedUsers.push(userId);
      const user = User.findById(userId);
      user.accessedAlbums.push(albumId);
      await user.save();
      await album.save();
    }

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add privileged user to album" });
  }
};

module.exports = addPrivilegedUser;
