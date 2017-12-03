var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

var castles = [
  {
    name: "Dunluce Castle",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Dunluce_Castle.jpg/256px-Dunluce_Castle.jpg"
  },
  {
    name: "Dunguaire Castle",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/6/6b/Dunguaire_Castle%2C_Galway%2C_Ireland.png"
  },
  {
    name: "Roscommon Castle",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/5/52/Roscommon_Castle.JPG"
  },
  {
    name: "Dunluce Castle",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Dunluce_Castle.jpg/256px-Dunluce_Castle.jpg"
  },
  {
    name: "Dunguaire Castle",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/6/6b/Dunguaire_Castle%2C_Galway%2C_Ireland.png"
  },
  {
    name: "Roscommon Castle",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/5/52/Roscommon_Castle.JPG"
  },
  {
    name: "Dunluce Castle",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Dunluce_Castle.jpg/256px-Dunluce_Castle.jpg"
  },
  {
    name: "Dunguaire Castle",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/6/6b/Dunguaire_Castle%2C_Galway%2C_Ireland.png"
  },
  {
    name: "Roscommon Castle",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/5/52/Roscommon_Castle.JPG"
  }
];

app.get("/", function(req, res) {
  res.render("landing");
});

app.get("/castles", function(req, res) {
  res.render("castles", { castles: castles });
});

app.post("/castles", function(req, res) {
  // get data from form and add to castles array
  var name = req.body.name;
  var image = req.body.image;
  var newCastle = { name: name, image: image };
  castles.push(newCastle);
  // redirect back to castles page
  res.redirect("/castles");
});

app.get("/castles/new", function(req, res) {
  res.render("new.ejs");
});

app.listen(3000, function() {
  console.log("The Castlepedia server has started.");
});
