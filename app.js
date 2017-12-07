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
  image: String
});

var Castle = mongoose.model("Castle", castleSchema);

app.get("/", function(req, res) {
  res.render("landing");
});

app.get("/castles", function(req, res) {
  // Get all castles from DB
  Castle.find({}, function(err, allCastles) {
    if (err) {
      console.log(err);
    } else {
      res.render("castles", { castles: allCastles });
    }
  });
});

app.post("/castles", function(req, res) {
  // get data from form and add to castles array
  var name = req.body.name;
  var image = req.body.image;
  var newCastle = { name: name, image: image };
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

app.get("/castles/new", function(req, res) {
  res.render("new.ejs");
});

app.listen(3000, function() {
  console.log("The Castlepedia server has started.");
});
