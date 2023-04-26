const Album = require("../../Schema/Album");
const User = require("../../Schema/User");

const createAlbum = async (req, res) => {
  const { name, img, userId } = req.body;

  try {
    const album = await Album.create({
      name,
      followers: [],
      privilegedUsers: [userId],
      image:
        img ??
        "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-541.jpg",
    });

    const user = await User.findById(userId);
    user.accessedAlbums.push(album._id);
    await user.save();

    res.status(201).json(album);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create album" });
  }
};

module.exports = createAlbum;
