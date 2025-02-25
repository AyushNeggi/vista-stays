// Main server file for Vista Stay

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config(); // Load environment variables in development mode
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); // EJS layout engine
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo"); // MongoDB session store

const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// Import route files
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// Connect to MongoDB Atlas
const dbUrl = process.env.ATLASDB_URL; // MongoDB Cloud URL

async function connectDB() {
  try {
    await mongoose.connect(dbUrl);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Database Connection Error:", err);
  }
}

connectDB();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public"))); // Serve static files

// Configure MongoDB session store
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600, // Interval between session updates (in seconds)
});

store.on("error", (err) => {
  console.error("MongoDB Session Store Error:", err);
});

// Session configuration
const sessionOptions = {
  store, // Use Mongo session store
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days expiration
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, // Security measure to prevent XSS attacks
  },
};

// Middleware
app.use(session(sessionOptions));
app.use(flash());

// Authentication setup
app.use(passport.initialize()); // Initialize Passport.js
app.use(passport.session()); // Maintain user session
passport.use(new LocalStrategy(User.authenticate())); // Use local authentication strategy

passport.serializeUser(User.serializeUser()); // Store user data in session
passport.deserializeUser(User.deserializeUser()); // Retrieve user data from session

// Global middleware to pass data to templates
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user || null; // Current logged-in user
  next();
});

// Routes
app.use("/listings", listingRouter); // Routes for listings
app.use("/listings/:id/reviews", reviewRouter); // Routes for reviews (mergeParams needed in router)
app.use("/", userRouter); // User authentication routes

// Handle all unknown routes (404 error)
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// Start server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
