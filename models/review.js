// Schema for customer or user reviews
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user.js");

const reviewSchema = new Schema({
  comment: String, // Stores the text of the review
  rating: {
    type: Number,
    min: 1, // Minimum rating value
    max: 5, // Maximum rating value
  },
  createdAt: {
    type: Date,
    default: Date.now(), // Automatically sets the creation date
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User", // References the User model to track review authorship
  },
});

module.exports = mongoose.model("Review", reviewSchema);
