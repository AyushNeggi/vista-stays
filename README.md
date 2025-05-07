Connect with me on LinkedIn :  https://www.linkedin.com/in/ayushneggi/
Made with ❤️ by Ayush Negi

# 🏡 Vista-Stays — A Full-Stack Hotel Booking Platform

🔗 Live Demo: https://vista-stays.onrender.com

https://github.com/AyushNeggi/vista-stays


**Vista-Stays** is a full-stack web application inspired by Airbnb, built to allow users to explore, book, and review properties. This project showcases complete CRUD functionality, authentication, dynamic map integration, and a responsive UI — all built with a Node.js + MongoDB backend and EJS templating on the frontend.

## 🔧 Tech Stack

- **Frontend:** HTML, CSS, Bootstrap, EJS (Embedded JavaScript)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (hosted on MongoDB Atlas)
- **Authentication:** Passport.js
- **File Uploads:** Multer + Cloudinary
- **Validation:** Joi
- **Map Integration:** Mapbox

---

## ✨ Key Features

- 🔐 Secure User Authentication (Register/Login/Logout)
- 🏘 Property Listings with CRUD operations (Create, Read, Update, Delete)
- 📸 Image Uploads via Cloudinary
- 🌐 Mapbox integration for viewing property locations
- ⭐️ Reviews and Ratings for listings
- 📱 Fully responsive layout with Bootstrap
- 🧼 Server-side input validation using Joi
- 📂 Follows MVC architecture for clean code organization


## 🚀 Quick Start (Local Development)

```bash
git clone https://github.com/AyushNeggi/vista-stays.git
cd vista-stays
npm install

Create a .env file with your keys:

DB_URL=<your_mongodb_url>
MAPBOX_TOKEN=<your_mapbox_token>
CLOUDINARY_CLOUD_NAME=<your_cloudinary_name>
CLOUDINARY_KEY=<your_cloudinary_key>
CLOUDINARY_SECRET=<your_cloudinary_secret>
SESSION_SECRET=<your_secret_key>

then run 

npm start

Use these credentials to test the live demo:

Email: demo@example.com

Password: password123

What I Learned
Building a full-stack CRUD application with authentication

Integrating third-party APIs (Mapbox, Cloudinary)

Validating data securely with Joi

Structuring a Node.js project using MVC pattern

Handling middleware, sessions, and flash messages in Express





