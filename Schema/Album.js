const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  followers: [{
    type: mongoose.Schema.ObjectId,
    ref: 'users'
  }],
  privilegedUsers: [{
    type: mongoose.Schema.ObjectId,
    ref: 'users'
  }],
  image: {
    type: String,
    default: "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-541.jpg"
  }
});

const Album = mongoose.model('album', albumSchema);

module.exports = Album;
