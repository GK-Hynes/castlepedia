var mongoose = require("mongoose");
var Castle = require("./models/castle");
var Comment = require("./models/comment");

var data = [
  {
    name: "Dunluce Castle",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/e/e8/Dunluce_Castle.jpg",
    description: "Castle"
  },
  {
    name: "Roscommon Castle",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/5/52/Roscommon_Castle.JPG",
    description: "Castle"
  },
  {
    name: "Dunguaire Castle",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/6/6b/Dunguaire_Castle%2C_Galway%2C_Ireland.png",
    description: "Castle"
  }
];

function seedDB() {
  // Remove all castles
  Castle.remove({}, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("removed castles");
      // Add a few castles
      data.forEach(function(seed) {
        Castle.create(seed, function(err, castle) {
          if (err) {
            console.log(err);
          } else {
            console.log("added castle");
            // Create a comment
            Comment.create(
              {
                text: "This place is great",
                author: "Davey"
              },
              function(err, comment) {
                if (err) {
                  console.log(err);
                } else {
                  castle.comments.push(comment);
                  castle.save();
                  console.log("Created new comment");
                }
              }
            );
          }
        });
      });
    }
  });
}

module.exports = seedDB;
