var express = require("express");
var router = express.Router({ mergeParams: true });
var Castle = require("../models/castle");
var Comment = require("../models/comment");

// Comments new
router.get("/new", isLoggedIn, function(req, res) {
  // find castle by id
  Castle.findById(req.params.id, function(err, castle) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { castle: castle });
    }
  });
});

// Comments create
router.post("/", isLoggedIn, function(req, res) {
  //lookup castle using ID
  Castle.findById(req.params.id, function(err, castle) {
    if (err) {
      console.log(err);
      res.redirect("/castles");
    } else {
      // create new comment
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          console.log(err);
        } else {
          // add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          // connect new comment to castle
          castle.comments.push(comment);
          castle.save();
          // redirect to castle showpage
          res.redirect("/castles/" + castle._id);
        }
      });
    }
  });
});

// Middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
