//main js file

if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); //requiring ejsmate
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session"); //for express-session
const MongoStore = require('connect-mongo');  //for mongo-session alternative of express-session

const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js"); //express router
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;  //for mongoDB cloud

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public"))); //to use static files from public folder

const store=MongoStore.create({
  mongoUrl:dbUrl,
  cryto:{
   secret: process.env.SECRET,
  },
  touchAfter: 24*3600 ,//interval bewtween session updates(in sec)
});

store.on("error", ()=>{
   console.log("error in mongo session store",err);
});

const sessionOptions = {
  store,  //mongo store related 
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //expiration time of cookie
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, //for security purpose
  },
};




app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use(session(sessionOptions));
app.use(flash());

//authentication part

app.use(passport.initialize()); //a middleware that initializes passport
app.use(passport.session()); //a website should know that same user is requesting from different pages of same browser so for multiple req he dosn't need to signin multiple times
passport.use(new LocalStrategy(User.authenticate())); //all users should be authenticate from localStrategy with help of user.authenticate method

passport.serializeUser(User.serializeUser()); //to store user data in session
passport.deserializeUser(User.deserializeUser()); //to remove user data from session

app.use((req, res, next) => {
  //middleware
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user; //the person which is loggedin in current session
  next();
});

app.use("/listings", listingRouter); //use of express router all routes starting with /routes will go to listing file
app.use("/listings/:id/reviews", reviewRouter); // here id parameter doesn't go to review.js due to this error come as undefined comes when u will print id in review.js. mergeParams: true is used to send safely
app.use("/", userRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
