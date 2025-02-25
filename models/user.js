// Schema for users who sign up and log in

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose"); // Plugin to simplify user authentication

const userSchema = new Schema({
  // Username and password are automatically added by Passport-Local Mongoose

  email: {
    type: String,
    required: true, // Ensures email is provided during signup
  },
});

userSchema.plugin(passportLocalMongoose); // Integrates authentication methods into the schema

module.exports = mongoose.model("User", userSchema);
