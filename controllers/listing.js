// Import required modules and dependencies
const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding"); // Import Mapbox Geocoding service
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken }); // Initialize Mapbox geocoding client

// Route to fetch all listings (Index Route)
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({}); // Retrieve all listings from the database
  res.render("listings/index.ejs", { allListings }); // Render the index page with the listings
};

// Route to render form for creating a new listing (New Route)
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs"); // Render the form for creating a new listing
};

// Route to create a new listing (Create Route)
module.exports.createListing = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location, // Convert location input into geographic coordinates
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id; // Assign the logged-in user as the listing owner
  newListing.image = { url, filename }; // Store the uploaded image URL and filename
  newListing.geometry = response.body.features[0].geometry; // Store geolocation data

  await newListing.save(); // Save the new listing in the database
  req.flash("success", "New listing created"); // Flash success message upon creation
  res.redirect("/listings");
};

// Route to display a specific listing (Show Route)
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews", // Populate reviews associated with the listing
      populate: {
        path: "author", // Further populate review authors
      },
    })
    .populate("owner"); // Populate listing owner details

  if (!listing) {
    req.flash("error", "The listing you requested doesn't exist"); // Flash error message if listing is not found
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing }); // Render the listing details page
};

// Route to render the edit form for a listing (Edit Route)
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "The listing you requested doesn't exist"); // Flash error message if listing is not found
    return res.redirect(`/listings`);
  }
  let originalImageUrl = listing.image.url.replace("/upload", "/upload/w_250"); // Generate a resized preview of the image
  res.render("listings/edit.ejs", { listing, originalImageUrl }); // Render edit form
};

// Route to update an existing listing (Update Route)
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }); // Update listing details in the database

  if (typeof req.file !== "undefined") {
    // If a new image is uploaded, update the listing image
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing updated successfully"); // Flash success message upon update
  res.redirect(`/listings/${id}`);
};

// Route to delete a listing (Delete Route)
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id); // Remove the listing from the database
  req.flash("success", "Listing deleted successfully"); // Flash success message upon deletion
  res.redirect("/listings");
};