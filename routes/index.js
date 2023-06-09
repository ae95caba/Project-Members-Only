var express = require("express");
var router = express.Router();

// Require controller modules.
const user_controller = require("../controllers/userController");
const message_controller = require("../controllers/messageController");
const signup_controller = require("../controllers/signupController");

/* The passport middleware checks to see if there is a 
user logged in (by checking the cookies that come in
	 with the req object) and if there is, it adds that
		 user to the request object for us. So, all we need to
			 do is check for req.user to change our view depending
				 on whether or not a user is logged in. */
router.get("/", function (req, res, next) {
  res.render("index", { user: req.user });
});

router.get("/sign-up", signup_controller.signup_create_get);

router.post("/sign-up", signup_controller.signup_create_post);

router.get("/log-out", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
