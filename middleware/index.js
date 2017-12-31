var Castle = require("../models/castle");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkCastleOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Castle.findById(req.params.id, function(err, foundCastle) {
      if (err) {
        req.flash("error", "Castle not found");
        res.redirect("back");
      } else {
        // check if foundCastle exists
        if (!foundCastle) {
          req.flash("error", "Castle not found");
          return res, redirect("back");
        }
        // does user own the castle?
        if (foundCastle.author.id.equals(req.user._id) || req.user.isAdmin) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");
  }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err) {
        res.redirect("back");
      } else {
        // check if foundComment exists
        if (!foundComment) {
          req.flash("error", "Comment not found");
          return res, redirect("back");
        }
        // does user own the comment?
        if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to be logged in to do that");
  res.redirect("/login");
};

module.exports = middlewareObj;
