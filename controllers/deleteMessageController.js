const User = require("../models/user");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { body, query, validationResult } = require("express-validator");
const Message = require("../models/message");

// Handle BookInstance update on POST.
exports.delete_message_post = [
  // Validate body and sanitize fields.
  //validate and sanitize query
  query("id").trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    const message = await Message.findById(req.query.id);

    // Extract the validation errors from a request.

    const errors = validationResult(req);
    console.log(errors);

    if (!errors.isEmpty() || !message) {
      // There are errors.

      res.render("error");
      return;
    } else {
      await Message.findByIdAndRemove(req.query.id);

      res.redirect("/");
    }
  }),
];
