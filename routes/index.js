var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Castle = require("../models/castle");
var middleware = require("../middleware");

// Root route
router.get("/", function(req, res) {
  res.render("landing");
});

// Show register form
router.get("/register", function(req, res) {
  res.render("register", { page: "register" });
});

// Handle signup logic
router.post("/register", function(req, res) {
  var newUser = new User({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    avatar: req.body.avatar,
    email: req.body.email,
    bio: req.body.bio
  });
  if (req.body.adminCode === "linustechtips") {
    newUser.isAdmin = true;
  }
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.render("register", { error: err.message });
    }
    passport.authenticate("local")(req, res, function() {
      req.flash(
        "success",
        "Successfully signed up! Welcome to Castlepedia " + user.username
      );
      res.redirect("/castles");
    });
  });
});

// Show login form
router.get("/login", function(req, res) {
  res.render("login", { page: "login" });
});

// Handle login logic
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/castles",
    failureRedirect: "/login"
  }),
  function(req, res) {}
);

// logout route
router.get("/logout", function(req, res) {
  req.logout();
  req.flash("success", "Logged you out!");
  res.redirect("/castles");
});

// USER PROFILES
router.get("/users/:id", function(req, res) {
  User.findById(req.params.id, function(err, foundUser) {
    if (err || !foundUser) {
      req.flash("error", "User not found");
      res.redirect("/castles");
    }
    // Find all castles created by this user
    Castle.find()
      .where("author.id")
      .equals(foundUser._id)
      .exec(function(err, castles) {
        if (err) {
          req.flash("error", "Castles not found");
          res.redirect("back");
        }
        res.render("users/show", { user: foundUser, castles: castles });
      });
  });
});

// EDIT USER PROFILE ROUTE
router.get("/users/:id/edit", function(req, res) {
  User.findById(req.params.id, function(err, foundUser) {
    if (err || !foundUser) {
      req.flash("error", "User not found");
      res.redirect("back");
    } else {
      res.render("users/edit", { user: foundUser });
    }
  });
});

// UPDATE USER PROFILE ROUTE
router.put("/users/:id", function(req, res) {
  var newData = {
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    avatar: req.body.avatar,
    bio: req.body.bio
  };
  User.findByIdAndUpdate(req.params.id, { $set: newData }, function(err, user) {
    if (err) {
      req.flash("error", "User not found");
      res.redirect("back");
    } else {
      req.flash("success", "Profile Updated!");
      res.redirect("/users/" + user._id);
    }
  });
});

module.exports = router;
