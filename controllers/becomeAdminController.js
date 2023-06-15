const User = require("../models/user");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { body, query, validationResult } = require("express-validator");

// Display bookinstance update form on GET.
exports.become_admin_get = asyncHandler(async (req, res, next) => {
  // Get bookinstance and authors for form.

  const user = req.user;

  if (!user) {
    // user not logged in.
    const err = new Error("User not logged in");
    err.status = 404;
    return next(err);
  }

  res.render("become_admin_form", {
    errors: undefined,
  });
});

// Handle BookInstance update on POST.
exports.become_admin_post = [
  // Validate body and sanitize fields.
  body("code").equals("asdf1234").withMessage("Invalid code"),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.

    const errors = validationResult(req);
    console.log(errors);

    if (!errors.isEmpty()) {
      // There are errors.
      // Render form again
      res.render("join_form", {
        errors: errors.array(),
      });
      return;
    } else {
      //third change in realtion to change book
      // Data from form is valid. Update the record.
      const theuser = await User.findByIdAndUpdate(
        req.user._id,
        { admin: true },
        {}
      );
      // Redirect to book detail page.
      res.redirect("/");
    }
  }),
];
