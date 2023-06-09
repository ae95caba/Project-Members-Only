var express = require("express");
var router = express.Router();
const Message = require("../models/message");
const asyncHandler = require("express-async-handler");

// Require controller modules.
const user_controller = require("../controllers/userController");

const signup_controller = require("../controllers/signupController");
const join_controller = require("../controllers/joinController");
const create_message_controller = require("../controllers/createMessageController");
const delete_message_controller = require("../controllers/deleteMessageController");
const become_admin_controller = require("../controllers/becomeAdminController.js");

/* The passport middleware checks to see if there is a 
user logged in (by checking the cookies that come in
	 with the req object) and if there is, it adds that
		 user to the request object for us. So, all we need to
			 do is check for req.user to change our view depending
				 on whether or not a user is logged in. */
router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    const messages = await Message.find().populate("user").exec();

    console.log(`the user is ${req.user}`);

    res.render("index", { user: req.user, messages: messages });
  })
);

//the log-in route is missing here, IT IS IN THE APP.JS

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

//makes a USER a member (changes its member status)

router.get("/join", join_controller.join_get);

router.post("/join", join_controller.join_post);

/////////////

router.get("/become-admin", become_admin_controller.become_admin_get);

router.post("/become-admin", become_admin_controller.become_admin_post);

router.get("/create-message", create_message_controller.create_message_get);

router.post("/create-message", create_message_controller.create_message_post);

router.post("/delete-message", delete_message_controller.delete_message_post);

module.exports = router;
