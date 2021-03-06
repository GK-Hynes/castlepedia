var express = require("express");
var router = express.Router({ mergeParams: true });
var Castle = require("../models/castle");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// NEW Comments
router.get("/new", middleware.isLoggedIn, function(req, res) {
  // find castle by id
  Castle.findById(req.params.id, function(err, castle) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { castle: castle });
    }
  });
});

// CREATE Comments
router.post("/", middleware.isLoggedIn, function(req, res) {
  //lookup castle using ID
  Castle.findById(req.params.id, function(err, castle) {
    if (err) {
      console.log(err);
      res.redirect("/castles");
    } else {
      // create new comment
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          req.flash("error", "Something went wrong");
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
          req.flash("success", "Successfully added comment");
          res.redirect("/castles/" + castle._id);
        }
      });
    }
  });
});

// EDIT Comments
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(
  req,
  res
) {
  Comment.findById(req.params.comment_id, function(err, foundComment) {
    if (err) {
      res.redirect("back");
    } else {
      res.render("comments/edit", {
        castle_id: req.params.id,
        comment: foundComment
      });
    }
  });
});

// UPDATE Comments
router.put("/:comment_id", middleware.checkCommentOwnership, function(
  req,
  res
) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(
    err,
    updatedComment
  ) {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/castles/" + req.params.id);
    }
  });
});

// Destroy Comments
router.delete("/:comment_id", middleware.checkCommentOwnership, function(
  req,
  res
) {
  Comment.findByIdAndRemove(req.params.comment_id, function(err) {
    if (err) {
      res.redirect("back");
    } else {
      req.flash("success", "Comment deleted");
      res.redirect("/castles/" + req.params.id);
    }
  });
});

module.exports = router;
