var mongoose = require("mongoose");
var Castle = require("./models/castle");
var Comment = require("./models/comment");

var data = [
  {
    name: "Dunluce Castle",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/e/e8/Dunluce_Castle.jpg",
    description:
      "Duis pretium lacus sit amet auctor tempor. Sed at elementum ipsum. Proin vel interdum dolor. Sed viverra turpis in mattis euismod. Duis tristique lacus a commodo consectetur. Proin vehicula sapien ut sapien vulputate volutpat a vitae mi. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec sit amet dictum lacus. Donec eu purus eleifend, mollis nunc eget, posuere purus. Mauris volutpat gravida justo ac volutpat. Pellentesque dapibus, odio vitae semper imperdiet, nunc quam condimentum purus, non porta orci enim vitae nisi. Fusce ac lobortis metus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus auctor mi ligula, convallis placerat enim sagittis quis. Sed vitae elementum nulla."
  },
  {
    name: "Roscommon Castle",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/5/52/Roscommon_Castle.JPG",
    description:
      "Duis pretium lacus sit amet auctor tempor. Sed at elementum ipsum. Proin vel interdum dolor. Sed viverra turpis in mattis euismod. Duis tristique lacus a commodo consectetur. Proin vehicula sapien ut sapien vulputate volutpat a vitae mi. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec sit amet dictum lacus. Donec eu purus eleifend, mollis nunc eget, posuere purus. Mauris volutpat gravida justo ac volutpat. Pellentesque dapibus, odio vitae semper imperdiet, nunc quam condimentum purus, non porta orci enim vitae nisi. Fusce ac lobortis metus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus auctor mi ligula, convallis placerat enim sagittis quis. Sed vitae elementum nulla."
  },
  {
    name: "Dunguaire Castle",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/6/6b/Dunguaire_Castle%2C_Galway%2C_Ireland.png",
    description:
      "Duis pretium lacus sit amet auctor tempor. Sed at elementum ipsum. Proin vel interdum dolor. Sed viverra turpis in mattis euismod. Duis tristique lacus a commodo consectetur. Proin vehicula sapien ut sapien vulputate volutpat a vitae mi. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec sit amet dictum lacus. Donec eu purus eleifend, mollis nunc eget, posuere purus. Mauris volutpat gravida justo ac volutpat. Pellentesque dapibus, odio vitae semper imperdiet, nunc quam condimentum purus, non porta orci enim vitae nisi. Fusce ac lobortis metus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus auctor mi ligula, convallis placerat enim sagittis quis. Sed vitae elementum nulla."
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
