const Post = require("../../Schema/Post");

const listAlbumPosts = async (req, res) => {
  console.log;
  try {
    let posts = await Post.find({ author: req.params.userId })
      .populate("album", "_id name image")
      .populate("comments.commentedBy", "_id name image")
      .sort("-created")
      .exec();
    res.json(posts);
  } catch (error) {
    return res.status(400).json({
      error: error,
    });
  }
};

module.exports = listAlbumPosts;
