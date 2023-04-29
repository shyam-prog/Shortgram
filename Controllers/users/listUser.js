const Post = require("../../Schema/Post");

const list1 = async (req, res) => {
  console.log("in post find===========================================");
  try {
    let posts = await Post.find({ author: req.params.userId })
      .populate("author", "_id name image")
      .populate("comments.commentedBy", "_id name image")
      .populate("privilegedUsers", "_id name image")
      .sort("-created")
      .exec();
    res.json(posts);
  } catch (error) {
    return res.status(400).json({
      error: error,
    });
  }
};

module.exports = list1;
