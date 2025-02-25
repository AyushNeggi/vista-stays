// File to restructure review routes using Express Router

const express = require("express");
const router = express.Router({ mergeParams: true }); // Ensures parent route parameters (e.g., listing ID) are accessible
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js"); // Accessing Listing collection
const Review = require("../models/review.js");
const {
  validateReview, // Middleware to validate review data
  isLoggedIn, // Middleware to check if user is logged in
  isReviewAuthor, // Middleware to verify review ownership
} = require("../middleware.js");
const reviewController = require("../controllers/review.js");

// Route to create a new review for a listing
router.post(
  "/",
  isLoggedIn, // Ensures user is authenticated before posting a review
  validateReview, // Validates review data before saving
  wrapAsync(reviewController.createReview)
);

// Route to delete an existing review
router.delete(
  "/:reviewId",
  isLoggedIn, // Ensures user is authenticated before deleting a review
  isReviewAuthor, // Ensures only the review author can delete the review
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
