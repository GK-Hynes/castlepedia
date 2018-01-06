var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Castle = require("../models/castle");
var middleware = require("../middleware");

// USER PROFILES
router.get("/:id", function(req, res) {
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
router.get("/:id/edit", function(req, res) {
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
router.put("/:id", function(req, res) {
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
