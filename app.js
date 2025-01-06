const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const listingsRoutes = require("./Routes/listing.js");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const User = require("./models/user.js");
const passport = require("passport");
const passportLocal = require("passport-local");
const reviewRoutes = require("./Routes/review.js");
const userRoutes = require("./Routes/user.js");
const Listing = require("./models/listing.js");
const { isOwner } = require("./middleware.js");
const Review = require("./models/review.js");

// Set up EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

//Middleware Variable
const sessionOption = {
  secret: "mysupresecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  }
};


// Middleware for parsing JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser("secretecode"));
app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get("/", (req, res) => {
//   res.send("It is working!");
// });

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.destory = req.flash("destory");
  res.locals.curUser = req.user;
  next();
});

// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email: "student@gmail.com",
//     username: "Test"
//   });
//   let register = await User.register(fakeUser, "helloworl");
//   res.send(register);
// });


// Mongoose connection
mongoose
  .connect("mongodb://127.0.0.1:27017/Traveling")
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/listings", listingsRoutes);
app.use("/", userRoutes);
app.use("/", reviewRoutes);

app.all("*", (req, res, next) => {
  next(new ExpressError(500, "Page not found"))
});

//Error Heandling Middleware
app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong!" } = err;
  res.status(status).render("listings/error.ejs", { message });
});


// Start server
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});