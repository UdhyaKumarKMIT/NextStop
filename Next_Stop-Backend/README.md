**Node.js + Express project** 

📁 **src/**

* `controllers/` → API logic (auth, booking, bus, route)
* `models/` → Mongoose (or DB) schemas
* `routes/` → Express routes for each module
* `config/db.js` → Database connection
* Middleware for authentication (`authMiddleware.js`, `adminMiddleware.js`)

---

## 🚌 NextStop API Documentation

### 📘 Overview

NextStop is a RESTful API for a bus booking platform that includes:

* User authentication
* Bus and route management (admin)
* Booking and cancellation system
* JWT-based authentication middleware

---

## 🚀 Getting Started

### 1️⃣ Installation

```bash
git clone https://github.com/your-username/nextstop-backend.git
cd nextstop-backend
npm install
```

### 2️⃣ Setup Environment

Create a `.env` file in the root:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 3️⃣ Start Server

```bash
npm start
```

Server runs at: `http://localhost:5050/`

---

## 📂 Folder Structure

```
src/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── bookingController.js
│   ├── busController.js
│   └── routeController.js
├── models/
│   ├── User.js
│   ├── Bus.js
│   ├── Route.js
│   ├── Booking.js
│   ├── Feedback.js
│   └── Payment.js
├── models/middleware/
│   ├── authMiddleware.js
│   └── adminMiddleware.js
└── routes/
    ├── authRoutes.js
    ├── bookingRoutes.js
    ├── busRoutes.js
    └── routeRoutes.js
```

---

## 🔐 Authentication Routes (`/api/auth`)
---

## 🪪 Register User

**Method:** `POST`
**API:**

```bash
http://localhost:5050/api/auth/register
```

**JSON:**

```json
{
  "username": "john_doe1",
  "firstName": "John",
  "lastName": "Doe",
  "email": "udhyak9445@gmail.com",
  "mobileNo": "9871543211",
  "altMobileNo": "9444444224",
  "dob": "1992-03-12",
  "address": "12, MG Road, Madurai, TN",
  "password": "Password@123",
  "confirmPassword": "Password@123",
  "role": "user"
}
```

---

## 🔑 Login User

**Method:** `POST`
**API:**

```bash
http://localhost:5050/api/auth/login
```

**JSON:**

```json
{
  "username": "john_doe1",
  "email": "udhyak9445@gmail.com",
  "password": "Password@123"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 🔄 Forgot Password

**Method:** `POST`
**API:**

```bash
http://localhost:5050/api/auth/forgot-password
```

**JSON:**

```json
{
  "email": "udhyak9445@gmail.com"
}
```

**Response:**

```json
{
  "message": "Reset code sent to email"
}
```

---

## 🔁 Reset Password

**Method:** `POST`
**API:**

```bash
http://localhost:5050/api/auth/reset-password
```

**JSON:**

```json
{
  "email": "udhyak9445@gmail.com",
  "code": "964630",
  "newPassword": "12345"
}
```

**Response:**

```json
{
  "message": "Password reset successful"
}
```

---
