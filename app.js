var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var localStrategy = require("passport-local");
var session = require("express-session");
var Castle = require("./models/castle");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

mongoose.connect("mongodb://localhost/castlepedia", { useMongoClient: true });
mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

// PASSPORT CONFIGURATION
app.use(
  session({
    secret: "Go raibh maith agat",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

app.get("/castles/:id/comments/new", isLoggedIn, function(req, res) {
  // find castle by id
  Castle.findById(req.params.id, function(err, castle) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { castle: castle });
    }
  });
});

app.post("/castles/:id/comments", isLoggedIn, function(req, res) {
  //lookup castle using ID
  Castle.findById(req.params.id, function(err, castle) {
    if (err) {
      console.log(err);
      res.redirect("/castles");
    } else {
      // create new comment
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          console.log(err);
        } else {
          // connect new comment to castle
          castle.comments.push(comment);
          castle.save();
          // redirect to castle showpage
          res.redirect("/castles/" + castle._id);
        }
      });
    }
  });
});

// ==============
// AUTH ROUTES
// ==============

// Show register form
app.get("/register", function(req, res) {
  res.render("register");
});

// Handle signup logic
app.post("/register", function(req, res) {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function() {
      res.redirect("/castles");
    });
  });
});

// Show login form
app.get("/login", function(req, res) {
  res.render("login");
});

// Handle login logic
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/castles",
    failureRedirect: "/login"
  }),
  function(req, res) {}
);

// logout route
app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/castles");
});

// Middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

app.listen(3000, function() {
  console.log("The Castlepedia server has started.");
});
