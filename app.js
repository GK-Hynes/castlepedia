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

// Require routes
var castleRoutes = require("./routes/castles");
var commentRoutes = require("./routes/comments");
var indexRoutes = require("./routes/index");

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

// Provide currentUser on every route
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use("/castles", castleRoutes);
app.use("/castles/:id/comments", commentRoutes);
app.use("/", indexRoutes);

app.listen(3000, function() {
  console.log("The Castlepedia server has started.");
});
