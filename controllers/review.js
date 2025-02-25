const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

// Create a new review and associate it with a listing
module.exports.createReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id); // Find the listing by ID

  let newReview = new Review(req.body.review); // Create a new review from form data
  newReview.author = req.user._id; // Associate the review with the logged-in user
  listing.reviews.push(newReview); // Add the review to the listing's reviews array
  await newReview.save(); // Save the review in the database
  await listing.save(); // Save the updated listing
  req.flash("success", "Review created successfully"); // Flash success message

  res.redirect(`/listings/${listing._id}`); // Redirect to the listing page
};

// Delete a review from a listing
module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // Remove review reference from listing
  await Review.findByIdAndDelete(reviewId); // Delete the review from the database
  req.flash("success", "Review deleted successfully"); // Flash success message
  res.redirect(`/listings/${id}`); // Redirect back to the listing page
};
