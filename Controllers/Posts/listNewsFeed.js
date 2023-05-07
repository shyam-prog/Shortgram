const Post = require("../../Schema/Post");

const list = async (req, res) => {
  let userfollowing = req.profile.following;
  let albumfollowing = req.profile.followedAlbums;
  // userfollowing.push(req.profile._id);
  let following = [...albumfollowing, ...userfollowing];
  console.log(following, "================================ list feed");

  try {
    let posts = await Post.find({ author: { $in: req.profile.following } })
      .populate("author", "_id name image")
      .populate("comments.commentedBy", "_id name image")
      .sort("-created")
      .exec();
    let followedAlbumPosts = await Post.find({
      album: { $in: req.profile.followedAlbums },
    })
      .populate("album", "_id name image")
      .populate("comments.commentedBy", "_id name image")
      .sort("-created")
      .exec();
    console.log(
      followedAlbumPosts,
      "============ followed albums post==========="
    );
    res.json([...posts, ...followedAlbumPosts]);
  } catch (error) {
    return res.status(400).json({
      error: error,
    });
  }
};

module.exports = list;
