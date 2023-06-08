const User = require("../models/user");

const asyncHandler = require("express-async-handler");
const { body, query, validationResult } = require("express-validator");

exports.signup_create_get = function (req, res, next) {
  res.render("signup_form", { errors: undefined });
};

exports.signup_create_post = [
  // Validate body and sanitize fields.
  body("first_name", "First must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("last_name", "Last name must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  body("username", "Username must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .escape(),
  body("confirm_password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Confirm password must be at least 8 characters long")
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.

    const errors = validationResult(req);

    // Create a BookInstance object with escaped and trimmed data.
    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,

      username: req.body.username,
      password: req.body.confirm_password,
    });

    if (!errors.isEmpty()) {
      // There are errors.
      // Render form again with sanitized values and error messages.

      res.render("signup_form", {
        user: user,

        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid
      await user.save();
      res.redirect("/");
    }
  }),
];
