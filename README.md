# Natours API

![Natours Banner](https://your-banner-image-url.com)

## 🌍 Overview
Natours is a complete tour booking platform built with **Node.js**, **Express**, **MongoDB**, and **Mongoose**. It follows the **MVC architecture** and features **server-side rendering (SSR) with Pug templates** to deliver a dynamic and fully functional website. 

## 🚀 Features
- **User Authentication & Authorization** (JWT-based login & role-based access control)
- **Tour Management** (CRUD operations for tours, guides, and users)
- **Booking System** (Stripe payment integration for secure transactions)
- **Email Notifications** (Automated emails using Nodemailer)
- **Server-Side Rendering** (Using Pug templates for dynamic pages)
- **Performance Optimization** (Data sanitization, rate limiting, and security enhancements)
- **RESTful API** (Structured API with clean architecture)
- **Geospatial Queries** (Find tours near a location using GeoJSON)
- **Review & Ratings System** (Users can leave reviews and ratings for tours)

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Frontend (SSR):** Pug Templates
- **Authentication:** JWT, bcrypt.js
- **Payments:** Stripe API
- **Email Services:** Nodemailer
- **Geospatial Features:** MongoDB GeoJSON
- **Security:** Helmet, Express Rate Limit, Data Sanitization

## 📂 Project Structure
```
Natours/
│-- controllers/  # Business logic and API controllers
│-- models/       # Mongoose models for database schema
│-- public/       # Static assets (CSS, images, JS)
│-- routes/       # Express routers
│-- views/        # Pug templates for rendering pages
│-- app.js        # Main Express application
│-- server.js     # Server configuration and startup
│-- config.env    # Environment variables
```

## 🚀 Installation & Setup
```bash
# Clone the repository
git clone https://github.com/eltohamy3/Natours.git
cd Natours

# Install dependencies
npm install

# Set up environment variables (.env file)
cp config.env.example config.env

# Start development server
npm run dev
```

## 🎮 API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/tours` | GET | Get all tours |
| `/api/v1/tours/:id` | GET | Get a single tour |
| `/api/v1/tours` | POST | Create a new tour |
| `/api/v1/tours/:id` | PATCH | Update tour details |
| `/api/v1/tours/:id` | DELETE | Delete a tour |
| `/api/v1/users/signup` | POST | User registration |
| `/api/v1/users/login` | POST | User login |
| `/api/v1/users/updateMe` | PATCH | Update user profile |
| `/api/v1/users/deleteMe` | DELETE | Delete user account |
| `/api/v1/bookings/checkout-session/:tourId` | GET | Get Stripe checkout session |

## 🚀 Usage
- **Browse Tours:** View available tours with details, pricing, and reviews.
- **Book a Tour:** Securely book tours using Stripe payments.
- **Manage Account:** Users can update profiles, leave reviews, and track bookings.
- **Admin Controls:** Create, update, or delete tours, users, and bookings.

## 🤝 Contributing
Pull requests are welcome! If you'd like to contribute, please fork the repository and submit a PR with your improvements.

## 📜 License
This project is licensed under the MIT License.

## 🌟 Connect with Me
**Abdelrahman Eltohamy**  
🔗 [GitHub](https://github.com/eltohamy3)  
📧 Email: aboudeltohamy@gmail.com  

---
🚀 Happy Coding!
