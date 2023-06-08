var express = require("express");
var router = express.Router();

// Require controller modules.
const user_controller = require("../controllers/userController");
const message_controller = require("../controllers/messageController");
const signup_controller = require("../controllers/signupController");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/sign-up", signup_controller.signup_create_get);

router.post("/sign-up", signup_controller.signup_create_post);

module.exports = router;
