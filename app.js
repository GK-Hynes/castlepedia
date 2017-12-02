var express = require("express");
var app = express();

app.get("/", function(req, res) {
  res.send("Landing page here");
});

app.listen(3000, function() {
  console.log("The Castlepedia server has started");
});
