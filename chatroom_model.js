const mongoose = require("mongoose");

const chatroom_schema = mongoose.Schema({
  //   _id: mongoose.Schema.Types.ObjectId
  // name:String
});

module.exports = mongoose.model("chatroom_model", chatroom_schema);
