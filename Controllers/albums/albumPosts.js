const Post = require("../../Schema/Post");

const createPost = async (req, res) => {
  console.log(req.body);

  const { Text, pic, album } = req.body;

  const NewPost = await new Post({
    caption: Text,
    photo: pic,
    album: album.id,
    userDetails: { name: album.name, id: album.id },
  });

  try {
    let result = await NewPost.save();
    res.json(result);
  } catch (err) {
    return res.status(400).json({
      err,
    });
  }
};

module.exports = createPost;
