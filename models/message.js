const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  timestamp: { type: String, required: true },
  content: {
    type: String,
    required: true,
  },
});

// Virtual for book's URL
MessageSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/message/${this._id}`;
});

// Export model
module.exports = mongoose.model("Message", MessageSchema);
