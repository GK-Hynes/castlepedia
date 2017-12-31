var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
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
  var newUser = new User({ username: req.body.username });
  if (req.body.adminCode === "linustechtips") {
    newUser.isAdmin = true;
  }
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.render("register", { error: err.message });
    }
    passport.authenticate("local")(req, res, function() {
      req.flash("success", "Welcome to Castlepedia " + user.username);
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

module.exports = router;
