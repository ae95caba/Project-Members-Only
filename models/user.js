const mongoose = require("mongoose");
const { isEmail } = require("validator");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  username: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return isEmail(value); // Use a validator function from the 'validator' package
      },
      message: "Invalid email address",
    },
  },
  password: { type: String, required: true },
  admin: { type: Boolean, required: false },
  member: { type: Boolean, required: false },
});

// Virtual for book's URL
UserSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/bike/${this._id}`;
});

UserSchema.virtual("full_name").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `${this.first_name} ${this.last_name}`;
});

// Export model
module.exports = mongoose.model("User", UserSchema);
