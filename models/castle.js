var mongoose = require("mongoose");

var castleSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

module.exports = mongoose.model("Castle", castleSchema);
