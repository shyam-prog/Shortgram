const express = require("express");
const addFollower = require("../../Controllers/albums/addFollower");
const auth = require("../../middleware/auth");
const addFollowing = require("../../Controllers/albums/addFollowing");
const removeFollower = require("../../Controllers/albums/removeFollowers");
const removeFollowing = require("../../Controllers/albums/removeFollowing");
const findAlbum = require("../../Controllers/albums/findAlbum");
const albumById = require("../../Controllers/albums/albumById");
const giveAccess = require("../../Controllers/albums/giveAccess");
const createAlbum = require("../../Controllers/albums/createAlbum");
const list1 = require("../../Controllers/users/listUser");
const router = express.Router();

router.route("/create").post(createAlbum);
router.route("/follow").put(auth, addFollower, addFollowing);
router.route("/unfollow").put(auth, removeFollower, removeFollowing);
router.route("/search").post(auth, findAlbum);
router.route("/album/:albumId").get(auth, albumById);
router.route("/giveAccess").post(auth, giveAccess);
router.route("/feedAlbum/:albumId").get(list1);

module.exports = router;
