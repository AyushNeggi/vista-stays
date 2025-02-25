// Routes for user authentication (signup, login, logout)

const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

// Routes for user signup
router
  .route("/signup")
  .get(userController.renderSignupForm) // Renders signup form
  .post(wrapAsync(userController.signup)); // Handles user registration

// Routes for user login
router
  .route("/login")
  .get(userController.renderLoginForm) // Renders login form
  .post(
    saveRedirectUrl, // Middleware to save the URL user wanted to visit before login
    passport.authenticate("local", {
      failureRedirect: "/login", // Redirects to login if authentication fails
      failureFlash: true, // Displays error message on failure
    }),
    userController.login // Handles successful login
  );

// Route for user logout
router.get("/logout", userController.logout); // Logs user out and redirects to homepage

module.exports = router;
