const User = require("../models/user");

// Render the signup form
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

// Handle user signup
module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username }); // Create a new user instance
    const registeredUser = await User.register(newUser, password); // Register user with hashed password

    req.login(registeredUser, (err) => {
      // Automatically log in user after signup, storing session data
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Vista Stay!"); // Flash success message
      res.redirect("/listings"); // Redirect to the listings page
    });
  } catch (e) {
    req.flash("error", e.message); // Flash error message if signup fails
    res.redirect("/signup"); // Redirect back to signup page
  }
};

// Render the login form
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

// Handle user login
module.exports.login = async (req, res) => {
  req.flash("success", "Welcome to Vista Stay! You are logged in!"); // Flash success message
  let redirectUrl = res.locals.redirectUrl || "/listings"; // Redirect user to intended page after login
  res.redirect(redirectUrl);
};

// Handle user logout
module.exports.logout = (req, res) => {
  req.logout((err) => {
    // Passport method to end user session
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out now"); // Flash logout message
    res.redirect("/listings"); // Redirect to listings page after logout
  });
};
