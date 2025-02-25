// Server-side validation using Joi
const Joi = require("joi");

// Schema for validating listings
module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required().messages({
      "string.empty": "Title is required.",
    }),
    description: Joi.string().required().messages({
      "string.empty": "Description is required.",
    }),
    location: Joi.string().required().messages({
      "string.empty": "Location is required.",
    }),
    country: Joi.string().required().messages({
      "string.empty": "Country is required.",
    }),
    price: Joi.number().required().min(0).messages({
      "number.base": "Price must be a number.",
      "number.min": "Price cannot be negative.",
    }),
    image: Joi.string().uri().allow("", null).messages({
      "string.uri": "Image must be a valid URL.",
    }),
  }).required(),
});

// Schema for validating reviews
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5).messages({
      "number.base": "Rating must be a number.",
      "number.min": "Rating cannot be less than 1.",
      "number.max": "Rating cannot be greater than 5.",
    }),
    comment: Joi.string().required().messages({
      "string.empty": "Comment is required.",
    }),
  }).required(),
});
