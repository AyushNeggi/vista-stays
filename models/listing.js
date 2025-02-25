const mongoose = require("mongoose");
const Review = require("./review.js");
const User = require("./user.js");

const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String, // Optional description of the listing
  image: {
    url: String,
    filename: String,
  },
  price: {
    type: Number,
    required: true,
    min: 0, // Ensures that price is not negative
  },
  location: String, // Specifies the location of the listing
  country: String, // Specifies the country of the listing
  reviews: [
    {
      type: Schema.Types.ObjectId, // Stores the ID of each review associated with the listing
      ref: "Review", // References the Review model
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User", // References the User model to track listing ownership
  },
  geometry: {
    type: {
      type: String, // Defines the type of geographic data
      enum: ["Point"], // Ensures only 'Point' type is used for geolocation
      required: true,
    },
    coordinates: {
      type: [Number], // Stores latitude and longitude coordinates
      required: true,
    },
  },
});

// Mongoose middleware to delete associated reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } }); // Deletes all reviews related to the listing
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
