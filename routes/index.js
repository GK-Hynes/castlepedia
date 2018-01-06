var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Castle = require("../models/castle");
var middleware = require("../middleware");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");

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

// PASSWORD ROUTES
// Forgot password
router.get("/forgot", function(req, res) {
  res.render("forgot");
});

router.post("/forgot", function(req, res, next) {
  async.waterfall(
    [
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString("hex");
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            req.flash("error", "No account with that email exists");
            return res.redirect("/forgot");
          }

          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: "castlepedia@gmail.com",
            pass: process.env.GMAILPWD
          },
          tls: {
            rejectUnauthorized: false
          }
        });
        var mailOptions = {
          to: user.email,
          from: "castlepedia@gmail.com",
          subject: "Castlepedia Password Reset Request",
          text:
            "You are receiving this because you (or someone else) have requested the reset of the password for your Castlepedia account.\n\n" +
            "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
            "http://" +
            req.headers.host +
            "/reset/" +
            token +
            "\n\n" +
            "If you did not request this, please ignore this email and your password will remain unchanged.\n"
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          console.log("mail sent");
          req.flash(
            "success",
            "An email has been sent to " +
              user.email +
              " with further instructions."
          );
          done(err, "done");
        });
      }
    ],
    function(err) {
      if (err) return next(err);
      res.redirect("/forgot");
    }
  );
});

// Handle password reset tokens
router.get("/reset/:token", function(req, res) {
  User.findOne(
    {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    },
    function(err, user) {
      if (!user) {
        req.flash("error", "password reset token is invalid or has expired.");
        return res.redirect("forgot");
      }
      res.render("reset", { token: req.params.token });
    }
  );
});

router.post("/reset/:token", function(req, res) {
  async.waterfall(
    [
      function(done) {
        User.findOne(
          {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
          },
          function(err, user) {
            if (!user) {
              req.flash(
                "error",
                "Password reset token is invalid or has expired."
              );
              return res.redirect("back");
            }
            if (req.body.password === req.body.confirm) {
              user.setPassword(req.body.password, function(err) {
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;

                user.save(function(err) {
                  req.logIn(user, function(err) {
                    done(err, user);
                  });
                });
              });
            } else {
              req.flash("error", "Passwords do not match.");
              return res.redirect("back");
            }
          }
        );
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: "castlepedia@gmail.com",
            pass: process.env.GMAILPWD
          },
          tls: {
            rejectUnauthorized: false
          }
        });
        var mailOptions = {
          to: user.email,
          from: "castlepedia@gmail.com",
          subject: "Your password has been changed",
          text:
            "Hello, \n\n" +
            "This is a confirmation that the password for the Castlepedia account connected to the email: " +
            user.email +
            " has just been changed."
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash("success", "Success! Your password has been changed.");
          done(err);
        });
      }
    ],
    function(err) {
      res.redirect("/castles");
    }
  );
});

module.exports = router;
