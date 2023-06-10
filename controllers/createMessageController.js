const User = require("../models/user");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { body, query, validationResult } = require("express-validator");
const Message = require("../models/message");

// Display bookinstance update form on GET.
exports.create_message_get = asyncHandler(async (req, res, next) => {
  // Get bookinstance and authors for form.

  const user = req.user;

  if (!user) {
    // user not logged in.
    const err = new Error("User not logged in");
    err.status = 404;
    return next(err);
  }

  res.render("create_message_form", {
    errors: undefined,
    message: undefined,
  });
});

// Handle BookInstance update on POST.
exports.create_message_post = [
  // Validate body and sanitize fields.
  body("title", "A title is required").trim().isLength({ min: 1 }).escape(),
  body("content", "A message is required").trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.

    const errors = validationResult(req);
    console.log(errors);

    if (!errors.isEmpty()) {
      // There are errors.
      // Render form again
      res.render("create_message_form", {
        errors: errors.array(),
        message: { title: req.body.title, content: req.body.content },
      });
      return;
    } else {
      //third change in realtion to change book
      // Data from form is valid. Update the record.

      const message = new Message({
        title: req.body.title,
        content: req.body.content,
        timestamp: new Date(),
        user: req.user,
      });

      await message.save();

      // Redirect to book detail page.
      res.redirect("/");
    }
  }),
];
