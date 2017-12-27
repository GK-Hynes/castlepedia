var Castle = require("../models/castle");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkCastleOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Castle.findById(req.params.id, function(err, foundCastle) {
      if (err) {
        res.redirect("back");
      } else {
        // does user own the castle?
        if (foundCastle.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err) {
        res.redirect("back");
      } else {
        // does user own the comment?
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

module.exports = middlewareObj;
