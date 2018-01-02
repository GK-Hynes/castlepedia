var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var localStrategy = require("passport-local");
var methodOverride = require("method-override");
var session = require("express-session");
var Castle = require("./models/castle");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

// configure dotenv
require("dotenv").config();

// Require routes
var castleRoutes = require("./routes/castles");
var commentRoutes = require("./routes/comments");
var indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost/castlepedia", { useMongoClient: true });
mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require("moment");
// seedDB(); Seed the database

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
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/castles", castleRoutes);
app.use("/castles/:id/comments", commentRoutes);
app.use("/", indexRoutes);

app.listen(3000, function() {
  console.log("The Castlepedia server has started.");
});
