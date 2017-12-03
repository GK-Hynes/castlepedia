var express = require("express");
var app = express();

app.set("view engine", "ejs");

app.get("/", function(req, res) {
  res.render("landing");
});

app.get("/castles", function(req, res) {
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
    }
  ];
  res.render("castles", { castles: castles });
});

app.listen(3000, function() {
  console.log("The Castlepedia server has started.");
});
