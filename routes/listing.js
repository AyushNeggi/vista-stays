// File for restructuring listing routes

const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js"); // Accessing Listing collection
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js"); // Middleware functions for authentication and validation
const listingController = require("../controllers/listing.js");
const multer = require("multer"); // Middleware for handling file uploads
const { storage } = require("../cloudConfig.js");

const upload = multer({ storage }); // Configuring file storage destination

router
  .route("/") // Handles requests for the base listings route
  .get(wrapAsync(listingController.index)) // Route to display all listings (index route)
  .post(
    isLoggedIn, // Ensures user is authenticated before creating a listing
    upload.single("listing[image]"), // Handles image upload
    validateListing, // Validates listing data before saving
    wrapAsync(listingController.createListing)
  );

// Route to render the form for creating a new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing)) // Route to display a specific listing (show route)
  .put(
    isLoggedIn, // Ensures user is authenticated
    isOwner, // Ensures only the listing owner can update
    upload.single("listing[image]"), // Handles image upload during update
    validateListing, // Validates updated listing data
    wrapAsync(listingController.updateListing)
  ) // Route to update a listing (update route)
  .delete(isLoggedIn, isOwner, listingController.destroyListing); // Route to delete a listing (delete route)

// Route to render the form for editing an existing listing
router.get("/:id/edit", isLoggedIn, isOwner, listingController.renderEditForm);

module.exports = router;
