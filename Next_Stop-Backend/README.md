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

Server runs at: `http://localhost:5000/`

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

| Method | Endpoint                    | Description                 | Auth Required |
| :----: | :-------------------------- | :-------------------------- | :-----------: |
| `POST` | `/api/auth/register`        | Register a new user         |       ❌       |
| `POST` | `/api/auth/login`           | Login and receive JWT token |       ❌       |
| `POST` | `/api/auth/forgot-password` | Request password reset      |       ❌       |
| `POST` | `/api/auth/reset-password`  | Reset password using token  |       ❌       |

🧠 **Example Login Request**

```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "mypassword"
}
```

Response:

```json
{
  "success": true,
  "token": "your_jwt_token"
}
```

---

## 🚌 Bus Routes (`/api/buses`)

|  Method  | Endpoint                        | Description     | Auth |  Role |
| :------: | :------------------------------ | :-------------- | :--: | :---: |
|   `GET`  | `/api/buses/`                   | Get all buses   |   ❌  |   -   |
|   `GET`  | `/api/buses/search?from=A&to=B` | Search buses    |   ❌  |   -   |
|   `GET`  | `/api/buses/:id`                | Get bus by ID   |   ❌  |   -   |
|  `POST`  | `/api/buses/add`                | Add new bus     |   ✅  | Admin |
|   `PUT`  | `/api/buses/:id`                | Update bus info |   ✅  | Admin |
| `DELETE` | `/api/buses/:id`                | Delete bus      |   ✅  | Admin |

---

## 🗺️ Route Management (`/api/routes`)

|  Method  | Endpoint          | Description     | Auth |  Role |
| :------: | :---------------- | :-------------- | :--: | :---: |
|   `GET`  | `/api/routes/`    | Get all routes  |   ❌  |   -   |
|   `GET`  | `/api/routes/:id` | Get route by ID |   ❌  |   -   |
|  `POST`  | `/api/routes/add` | Add a new route |   ✅  | Admin |
|   `PUT`  | `/api/routes/:id` | Update a route  |   ✅  | Admin |
| `DELETE` | `/api/routes/:id` | Delete a route  |   ✅  | Admin |

---

## 🎫 Booking Routes (`/api/bookings`)

| Method | Endpoint                   | Description                    | Auth |
| :----: | :------------------------- | :----------------------------- | :--: |
| `POST` | `/api/bookings/`           | Book a ticket                  |   ✅  |
|  `PUT` | `/api/bookings/cancel/:id` | Cancel a booking               |   ✅  |
|  `GET` | `/api/bookings/user`       | View logged-in user’s bookings |   ✅  |


```
key: token
value: <paste JWT token from /login response>
```

Then under each **protected request**, go to **Authorization → Bearer Token** and set:

```
{{token}}
```

### Step 3 — Example Flow

1️⃣ Register → `/api/auth/register`
2️⃣ Login → copy JWT token
3️⃣ Add Bus → `/api/buses/add` (as Admin)
4️⃣ Book Ticket → `/api/bookings/`
5️⃣ View Bookings → `/api/bookings/user`

---

## 🧰 Tech Stack

* **Node.js** + **Express.js**
* **MongoDB** with Mongoose
* **JWT** for Authentication
* **Postman** for API testing

---


# 🚏 Route Management API

API for managing transportation routes. Public can view routes; admins can create, update, and delete them.

## 📍 Base URL

```
http://localhost:5050/api/routes
```

## 🔐 Authentication

* **Public Routes**: No authentication
* **Admin Routes**: Bearer token required

---

## 📘 Endpoints

### 1. Get All Routes

* **GET** `/`
* **Auth**: Public
* **Response**: Array of route objects

---

### 2. Get Route by ID

* **GET** `/:id`
* **Auth**:  Public
* **Params**:

  * `id`: Route ID
* **Response**: Single route object

---

### 3. Add New Route

* **POST** `/add`
* **Auth**: ✅ Admin
* **Headers**:

  ```
  Authorization: Bearer <token>
  Content-Type: application/json
  ```
* **Body**:

  ```json
  {
    "startPoint": "Madurai",
    "endPoint": "Chennai",
    "distance": 460,
    "duration": "7h 30m"
  }
  ```
* **Response**: Created route object

---

### 4. Update Route

* **PUT** `/:id`
* **Auth**: ✅ Admin
* **Headers**:

  ```
  Authorization: Bearer <token>
  Content-Type: application/json
  ```
* **Params**:

  * `id`: Route ID
* **Body**:

  ```json
  {
    "startPoint": "Updated Start",
    "endPoint": "Updated End",
    "distance": 500,
    "duration": "8h 00m"
  }
  ```
* **Response**: Updated route object

---

### 5. Delete Route

* **DELETE** `/:id`
* **Auth**: ✅ Admin
* **Headers**:

  ```
  Authorization: Bearer <token>
  ```
* **Params**:

  * `id`: Route ID
* **Response**: Success message


---

# 🎟️ Booking API

Handles ticket bookings, cancellations, and retrieving user-specific bookings.

## 📍 Base URL

```
http://localhost:5050/api/bookings
```

## 🔐 Authentication

* **All Booking Routes**: Require user authentication via Bearer token

---

## 📘 Endpoints

### 1. Book a Ticket

* **POST** `/`
* **Auth**: ✅ Required
* **Headers**:

  ```
  Authorization: Bearer <token>
  Content-Type: application/json
  ```
* **Body**:

  ```json
  {
    "bus": "bus_id_here",
    "seatsBooked": 2,
    "totalFare": 800
  }
  ```
* **Response**: Booking confirmation object

---

### 2. Cancel a Booking

* **PUT** `/cancel/:id`
* **Auth**: ✅ Required
* **Headers**:

  ```
  Authorization: Bearer <token>
  ```
* **Params**:

  * `id`: Booking ID to cancel
* **Response**: Updated booking object with status `"Cancelled"`

---

### 3. Get User Bookings

* **GET** `/user`
* **Auth**: ✅ Required
* **Headers**:

  ```
  Authorization: Bearer <token>
  ```
* **Response**: Array of user’s booking objects

---
