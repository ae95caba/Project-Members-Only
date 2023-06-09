var createError = require("http-errors");
var express = require("express");
var path = require("path");
const User = require("./models/user");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
const bcrypt = require("bcryptjs");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// Set up mongoose connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGODB_URI || process.env.DEV_DB_URL;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
  console.log("Connected to MongoDB");
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Set up session middleware
app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
//3 functions
//we aren’t going to be calling these functions on our own, they’re used in the background by passport.

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          // Passwords match! Log the user in
          return done(null, user);
        } else {
          // Passwords do not match
          console.log("incorret password");
          return done(null, false, { message: "Incorrect password" });
        }
      });
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Initialize Passport and session middleware
app.use(passport.initialize());
app.use(passport.session());
////////////////////////////////
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

/* all we have to do is call passport.authenticate().
 This middleware performs numerous functions behind the scenes. 
	Among other things, it looks at the request body for 
	parameters named username and password then runs the
	 LocalStrategy function that we defined earlier to see 
		if the username and password are in the database. 
		It then creates a session cookie that gets stored
		 in the user’s browser, and that we can access in all 
			future requests to see whether or not that user is logged in.
			 It can also redirect you to different routes based on
				 whether the login is a success or a failure.  */
app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
