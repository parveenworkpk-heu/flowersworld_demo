# Flowers World - Full Stack E-Commerce Application

## Project Documentation

---

## 1. Project Overview

**Project Name:** Flowers World  
**Project Type:** Full Stack E-Commerce Web Application  
**Description:** A complete online flower shop with product catalog, shopping cart, user authentication, order management, and admin dashboard.  
**Live URLs:**
- Frontend: https://flowers-world-one.vercel.app
- Backend: https://flowersworld-backend.onrender.com

---

## 2. Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| React Router DOM | Routing |
| Axios | HTTP Client |
| Recharts | Dashboard Charts |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | Web Framework |
| JWT | Authentication |
| bcryptjs | Password Hashing |
| Helmet | Security Headers |
| CORS | Cross-Origin Support |
| File-based Storage | JSON Database |

### Deployment
| Service | Purpose |
|---------|---------|
| Vercel | Frontend Hosting |
| Render | Backend API Hosting |
| GitHub | Version Control |

---

## 3. Project Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (Vercel)                     │
│  https://flowers-world-one.vercel.app                       │
│                                                              │
│  ┌─────────┐  ┌─────────┐  ┌──────────┐  ┌─────────────┐     │
│  │  Home   │  │  Shop   │  │  Login   │  │   /admin   │     │
│  │  Page   │  │  Page   │  │  Register│  │  Dashboard │     │
│  └─────────┘  └─────────┘  └──────────┘  └─────────────┘     │
└────────────────────────────┬────────────────────────────────┘
                             │
                    REACT_APP_API_URL
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                       BACKEND (Render)                       │
│  https://flowersworld-backend.onrender.com                  │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  /api    │  │  /api    │  │  /api    │  │  /api    │   │
│  │  /auth   │  │/products │  │  /orders │  │  /admin  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐  │
│  │              data.json (File-based DB)                │  │
│  │   - users[]  - products[]  - orders[]                │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Features

### Customer Features
- **Product Catalog**: Browse flowers with categories, search, sort, and filters
- **Product Details**: View detailed product information with images
- **Shopping Cart**: Add/remove items, quantity management
- **User Registration**: Create new account with email validation
- **User Login**: Secure authentication with JWT tokens
- **Checkout**: Order placement with COD/UPI payment options
- **Order History**: View past orders and their status
- **Address Management**: Save and manage delivery addresses

### Admin Features
- **Dashboard**: Analytics with charts (sales, orders, users)
- **Product Management**: Add, edit, delete products with images
- **Order Management**: View, update order status
- **User Management**: View users, block/unblock accounts
- **Analytics**: Revenue charts, order trends, category breakdown

---

## 5. Database Schema

### Users Collection
```json
{
  "_id": "user_xxxxx",
  "name": "User Name",
  "email": "user@example.com",
  "password": "$2a$12$hashedpassword",
  "phone": "9876543210",
  "role": "user" | "admin",
  "isBlocked": false,
  "addresses": [
    {
      "name": "Home",
      "phone": "9876543210",
      "address": "123 Street",
      "city": "City",
      "state": "State",
      "pincode": "123456"
    }
  ],
  "createdAt": "2026-04-03T00:00:00.000Z"
}
```

### Products Collection
```json
{
  "_id": "prod_1",
  "name": "Red Roses Bouquet",
  "description": "Beautiful fresh red roses",
  "price": 599,
  "discountPrice": 449,
  "images": ["https://image-url"],
  "category": "Roses",
  "stock": 25,
  "ratings": 4.5,
  "isFeatured": true,
  "isActive": true,
  "createdAt": "2026-04-03T00:00:00.000Z"
}
```

### Orders Collection
```json
{
  "_id": "order_xxxxx",
  "user": "user_xxxxx",
  "items": [
    {
      "product": "prod_1",
      "name": "Red Roses Bouquet",
      "quantity": 2,
      "price": 449,
      "image": "https://image-url"
    }
  ],
  "shippingDetails": {
    "name": "John Doe",
    "phone": "9876543210",
    "email": "john@example.com",
    "address": "123 Street",
    "city": "City",
    "state": "State",
    "pincode": "123456"
  },
  "paymentMethod": "COD" | "UPI",
  "totalAmount": 898,
  "status": "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled",
  "createdAt": "2026-04-03T00:00:00.000Z"
}
```

---

## 6. API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|-----------|--------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |
| PUT | `/api/auth/address` | Add/update address |

### Products
| Method | Endpoint | Description |
|--------|-----------|--------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product (admin) |
| PUT | `/api/products/:id` | Update product (admin) |
| DELETE | `/api/products/:id` | Delete product (admin) |

### Orders
| Method | Endpoint | Description |
|--------|-----------|--------------|
| GET | `/api/orders` | Get user orders |
| GET | `/api/orders/:id` | Get single order |
| POST | `/api/orders` | Create new order |
| PUT | `/api/orders/:id/status` | Update order status (admin) |

### Cart
| Method | Endpoint | Description |
|--------|-----------|--------------|
| GET | `/api/cart` | Get cart items |
| POST | `/api/cart` | Add to cart |
| PUT | `/api/cart` | Update cart item |
| DELETE | `/api/cart/:productId` | Remove from cart |

### Admin
| Method | Endpoint | Description |
|--------|-----------|--------------|
| GET | `/api/admin/analytics` | Get dashboard analytics |
| GET | `/api/admin/users` | Get all users |
| PUT | `/api/admin/users/:id/block` | Block/unblock user |

---

## 7. User Workflow

### Customer Flow
```
1. Visit Website
       │
       ▼
2. Browse Products / View Details
       │
       ▼
3. Add to Cart
       │
       ▼
4. Login/Register (if not logged in)
       │
       ▼
5. Checkout - Enter Shipping Details
       │
       ▼
6. Select Payment Method (COD/UPI)
       │
       ▼
7. Place Order
       │
       ▼
8. View Order History
```

### Admin Flow
```
1. Login as Admin
       │
       ▼
2. Access /admin Dashboard
       │
       ▼
3. View Analytics & Stats
       │
       ▼
4. Manage Products (CRUD)
       │
       ▼
5. Manage Orders (Update Status)
       │
       ▼
6. Manage Users (View/Block)
```

---

## 8. Installation & Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Git

### Backend Setup
```bash
cd server
npm install
npm start
# Server runs on http://localhost:5000
```

### Frontend Setup
```bash
cd client
npm install
npm start
# Client runs on http://localhost:3000
```

### Environment Variables

**Backend (.env)**
```
PORT=5000
JWT_SECRET=flowersworldsecretkey2024
NODE_ENV=production
CORS_ORIGIN=true
```

**Frontend**
- API URL is hardcoded in `src/config.js`

---

## 9. Credentials

### Admin Account
| Field | Value |
|-------|-------|
| Email | admin@flowersworld.com |
| Password | Admin123 |

### Demo Products
The application comes pre-loaded with 6 sample flower products with prices in INR.

---

## 10. Deployment Information

### GitHub Repositories
- **Frontend**: https://github.com/parveenworkpk-heu/flowersworld_demo
- **Backend**: https://github.com/parveenworkpk-heu/flowersworld_backend

### Live Deployment
| Service | URL | Status |
|---------|-----|--------|
| Frontend (Vercel) | https://flowers-world-one.vercel.app | Active |
| Backend (Render) | https://flowersworld-backend.onrender.com | Active |

### Build Commands

**Frontend (Vercel)**
```
Build Command: CI=false npx react-scripts build
Output Directory: build
```

**Backend (Render)**
```
Build Command: npm install
Start Command: node server.js
```

---

## 11. Project Structure

```
Flowers/
├── client/                    # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── Header.js
│   │   │   ├── Footer.js
│   │   │   ├── ProductCard.js
│   │   │   ├── CartDrawer.js
│   │   │   ├── AdminRoute.js
│   │   │   └── ProtectedRoute.js
│   │   ├── context/           # React Context
│   │   │   ├── AuthContext.js
│   │   │   └── CartContext.js
│   │   ├── pages/             # Page Components
│   │   │   ├── Home.js
│   │   │   ├── Shop.js
│   │   │   ├── ProductDetail.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Checkout.js
│   │   │   ├── Account.js
│   │   │   ├── AdminDashboard.js
│   │   │   ├── AdminProducts.js
│   │   │   ├── AdminOrders.js
│   │   │   └── AdminUsers.js
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
│
├── server/                    # Express Backend
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   ├── cart.js
│   │   └── admin.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── data.json              # File-based database
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## 12. Color Scheme

The application uses a premium flower shop color palette:

| Color | Hex Code | Usage |
|-------|----------|-------|
| Primary Pink | #C73086 | Main brand color |
| Blush Pink | #FFB6C1 | Accents |
| Sage Green | #8B9A7D | Secondary elements |
| Cream | #FFF8E7 | Backgrounds |
| Gold | #D4AF37 | Premium highlights |
| Dark | #1A1A1A | Text |

---

## 13. Security Features

- JWT Authentication with token expiry
- Password hashing with bcrypt (12 rounds)
- Helmet.js for security headers
- CORS configuration
- Input validation
- Role-based access control

---

## 14. Conclusion

This Flowers World e-commerce application is a complete full-stack solution with:
- Modern React frontend with elegant UI
- Secure Express.js backend
- File-based database (no external DB required)
- Complete admin dashboard
- User authentication and order management
- Deployed and live at vercel.app and render.com

The application demonstrates full CRUD operations, authentication, payment integration (COD/UPI), and responsive design suitable for production deployment.
