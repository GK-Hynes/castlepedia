var express = require("express");
var router = express.Router();
var Castle = require("../models/castle");
var Comment = require("../models/comment");
var middleware = require("../middleware");
var geocoder = require("geocoder");

//INDEX - show all castles
router.get("/", function(req, res) {
  // Get all castles from DB
  Castle.find({}, function(err, allCastles) {
    if (err) {
      console.log(err);
    } else {
      res.render("castles/index", {
        castles: allCastles,
        page: "castles"
      });
    }
  });
});

//CREATE - add new castles
router.post("/", middleware.isLoggedIn, function(req, res) {
  // get data from form and add to castles array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var price = req.body.price;
  geocoder.geocode(req.body.location, function(err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newCastle = {
      name: name,
      image: image,
      description: desc,
      price: price,
      author: author,
      location: location,
      lat: lat,
      lng: lng
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
});

//NEW - show form to create new castle
router.get("/new", middleware.isLoggedIn, function(req, res) {
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
        // render show template with that castle
        res.render("castles/show", { castle: foundCastle });
      }
    });
});

// EDIT Castle route
router.get("/:id/edit", middleware.checkCastleOwnership, function(req, res) {
  Castle.findById(req.params.id, function(err, foundCastle) {
    res.render("castles/edit", { castle: foundCastle });
  });
});

// UPDATE Castle route
router.put("/:id", middleware.checkCastleOwnership, function(req, res) {
  geocoder.geocode(req.body.location, function(err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = {
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
      price: req.body.price,
      location: location,
      lat: lat,
      lng: lng
    };
    // Find and update the correct castle
    Castle.findByIdAndUpdate(req.params.id, { $set: newData }, function(
      err,
      updatedCastle
    ) {
      if (err) {
        req.flash("error", err.message);
        res.redirect("back");
      } else {
        req.flash("success", "Successfully Updated!");
        res.redirect("/castles/" + req.params.id);
      }
    });
  });
});

// DESTROY Castle route
router.delete("/:id", middleware.checkCastleOwnership, function(req, res) {
  Castle.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/castles");
    } else {
      res.redirect("/castles");
    }
  });
});

module.exports = router;
