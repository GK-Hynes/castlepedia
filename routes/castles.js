var express = require("express");
var router = express.Router();
var Castle = require("../models/castle");

//INDEX - show all castles
router.get("/", function(req, res) {
  // Get all castles from DB
  Castle.find({}, function(err, allCastles) {
    if (err) {
      console.log(err);
    } else {
      res.render("castles/index", {
        castles: allCastles
      });
    }
  });
});

//CREATE - add new castles
router.post("/", isLoggedIn, function(req, res) {
  // get data from form and add to castles array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var newCastle = {
    name: name,
    image: image,
    description: desc,
    author: author
  };
  // Create a new castle and save to DB
  Castle.create(newCastle, function(err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      // redirect back to castles page
      res.redirect("/castles");
    }
  });
});

//NEW - show form to create new castle
router.get("/new", isLoggedIn, function(req, res) {
  res.render("castles/new");
});

//SHOW - shows more info about one castle
router.get("/:id", function(req, res) {
  // find the castle with the provided id
  Castle.findById(req.params.id)
    .populate("comments")
    .exec(function(err, foundCastle) {
      if (err) {
        console.log(err);
      } else {
        console.log(foundCastle);
        // render show template with that castle
        res.render("castles/show", { castle: foundCastle });
      }
    });
});

// EDIT Castle route
router.get("/:id/edit", checkCastleOwnership, function(req, res) {
  Castle.findById(req.params.id, function(err, foundCastle) {
    res.render("castles/edit", { castle: foundCastle });
  });
});

// UPDATE Castle route
router.put("/:id", checkCastleOwnership, function(req, res) {
  // Find and update the correct castle
  Castle.findByIdAndUpdate(req.params.id, req.body.castle, function(
    err,
    updatedCastle
  ) {
    if (err) {
      res.redirect("/castles");
    } else {
      res.redirect("/castles/" + req.params.id);
    }
  });
  // Redirect to the show page
});

// DESTROY Castle route
router.delete("/:id", checkCastleOwnership, function(req, res) {
  Castle.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/castles");
    } else {
      res.redirect("/castles");
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

function checkCastleOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    Castle.findById(req.params.id, function(err, foundCastle) {
      if (err) {
        res.redirect("/castles");
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
}

module.exports = router;
