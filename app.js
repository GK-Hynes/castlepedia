var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Castle = require("./models/castle");
var Comment = require("./models/comment");
var seedDB = require("./seeds");

mongoose.connect("mongodb://localhost/castlepedia", { useMongoClient: true });
mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

app.get("/", function(req, res) {
  res.render("landing");
});

//INDEX - show all castles
app.get("/castles", function(req, res) {
  // Get all castles from DB
  Castle.find({}, function(err, allCastles) {
    if (err) {
      console.log(err);
    } else {
      res.render("castles/index", { castles: allCastles });
    }
  });
});

//CREATE - add new castles
app.post("/castles", function(req, res) {
  // get data from form and add to castles array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newCastle = { name: name, image: image, description: desc };
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
app.get("/castles/new", function(req, res) {
  res.render("castles/new");
});

//SHOW - shows more info about one castle
app.get("/castles/:id", function(req, res) {
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

//==========================
// COMMENTS ROUTES
//==========================

app.get("/castles/:id/comments/new", function(req, res) {
  // find castle by id
  Castle.findById(req.params.id, function(err, castle) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { castle: castle });
    }
  });
});

app.post("/castles/:id/comments", function(req, res) {
  //lookup castle using ID
  Castle.findById(req.params.id, function(err, castle) {
    if (err) {
      console.log(err);
      res.redirect("/castles");
    } else {
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          console.log(err);
        } else {
          castle.comments.push(comment);
          castle.save();
          res.redirect("/castles/" + castle._id);
        }
      });
    }
  });
  // create new comment
  // connect new comment to castle
  // redirect to castle showpage
});

app.listen(3000, function() {
  console.log("The Castlepedia server has started.");
});
