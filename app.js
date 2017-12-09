var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/castlepedia");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// SCHEMA SETUP
var castleSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

var Castle = mongoose.model("Castle", castleSchema);

// Castle.create(
//   {
//     name: "Dunluce Castle",
//     image:
//       "https://upload.wikimedia.org/wikipedia/commons/e/e8/Dunluce_Castle.jpg",
//     description:
//       "Dunluce Castlen is a now-ruined medieval castle in Northern Ireland."
//   },
//   function(err, castle) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("Newly created castle:");
//       console.log(castle);
//     }
//   }
// );

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
      res.render("index", { castles: allCastles });
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
  res.render("new.ejs");
});

//SHOW - shows more info about one castle
app.get("/castles/:id", function(req, res) {
  // find the castle with the provided id
  Castle.findById(req.params.id, function(err, foundCastle) {
    if (err) {
      console.log(err);
    } else {
      // render show template with that castle
      res.render("show", { castle: foundCastle });
    }
  });
});

app.listen(3000, function() {
  console.log("The Castlepedia server has started.");
});
