// Load environment variables in development mode
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); // EJS layout engine for better templating
const ExpressError = require("./utils/ExpressError.js"); // Custom error handling class
const session = require("express-session"); // Session management middleware
const MongoStore = require('connect-mongo');  // MongoDB session store (alternative to default session storage)

const cookieParser = require("cookie-parser");
const flash = require("connect-flash"); // Flash messages middleware for success/error messages
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js"); // User model for authentication

// Importing route handlers
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;  // MongoDB Atlas connection URL

// Connect to MongoDB database
async function main() {
  await mongoose.connect(dbUrl);
}

main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
  });

// Set view engine and views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware setup
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded bodies (form submissions)
app.use(methodOverride("_method")); // Allows using PUT and DELETE methods in HTML forms
app.engine("ejs", ejsMate); // Set EJS Mate as the template engine
app.use(express.static(path.join(__dirname, "/public"))); // Serve static files from 'public' directory

// Configure MongoDB session store
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET, // Secret key for encrypting session data
  },
  touchAfter: 24 * 3600, // Reduce session updates (time in seconds)
});

// Handle errors in session store
store.on("error", (err) => {
  console.error("MongoDB Session Store Error:", err);
});

// Session configuration
const sessionOptions = {
  store, // Use MongoDB store for sessions
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // Set cookie expiration (7 days)
    maxAge: 7 * 24 * 60 * 60 * 1000, // Max cookie age (7 days)
    httpOnly: true, // Prevent client-side JavaScript access to cookies (security measure)
  },
};

// Apply session and flash middleware
app.use(session(sessionOptions));
app.use(flash());

// Passport.js authentication setup
app.use(passport.initialize()); // Initialize passport
app.use(passport.session()); // Persistent login sessions
passport.use(new LocalStrategy(User.authenticate())); // Local authentication strategy using User model

passport.serializeUser(User.serializeUser()); // Serialize user into session
passport.deserializeUser(User.deserializeUser()); // Deserialize user from session

// Middleware to set global template variables
app.use((req, res, next) => {
  res.locals.success = req.flash("success"); // Success message
  res.locals.error = req.flash("error"); // Error message
  res.locals.currUser = req.user; // Store logged-in user details in res.locals
  next();
});

// Route handlers
app.get("/", (req, res) => {
  res.redirect("/listings"); // Redirect root route to listings
});
app.use("/listings", listingRouter); // Routes for listings
app.use("/listings/:id/reviews", reviewRouter); // Routes for reviews (requires mergeParams: true in router)
app.use("/", userRouter); // Routes for user authentication and profiles

// Catch-all route for undefined routes
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

// Global error handling middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message }); // Render error page
});

// Start the server
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
