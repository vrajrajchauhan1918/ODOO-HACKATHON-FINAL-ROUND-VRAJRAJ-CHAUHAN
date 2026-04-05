# 🍽️ Odoo POS Cafe

A full-stack Restaurant POS (Point of Sale) system built for hackathon purposes.  
This project simulates a real-world cafe/restaurant workflow including table-based ordering, billing, kitchen communication, and reporting.

---

## 🚀 Tech Stack

### Frontend
- React (Vite)
- React Router
- Zustand (state management)
- Tailwind (utility styling)
- Recharts (analytics)
- QR Code (UPI payments)

### Backend
- Node.js + Express :contentReference[oaicite:0]{index=0}
- Prisma ORM
- PostgreSQL (intended DB)

---

## 📦 Project Structure

```
root/
│
├── public/
├── src/                # React frontend
├── server.js           # Express backend
├── package.json        # Scripts & dependencies :contentReference[oaicite:1]{index=1}
├── vite.config.js      # Frontend config :contentReference[oaicite:2]{index=2}
├── index.html          # Root HTML :contentReference[oaicite:3]{index=3}
```

---

## ⚡ Features (Implemented + Planned)

### ✅ Core Features
- Table/Floor based ordering system
- Product & category management
- Order creation & cart system
- Basic payment flow (Cash / Digital / UPI QR)
- Backend APIs for:
  - Floors & Tables
  - Products & Categories
  - Orders & Order Items

---

### 🧠 Advanced Features (Partially Implemented / Planned)
- POS Session management
- Kitchen Display System (KDS)
- Customer Display screen
- Reporting dashboard (sales, sessions, filters)
- QR-based UPI payment flow
- Self-ordering (token-based system)
- Role-based access (Admin / Staff)

---

## 🧾 POS Flow Overview

1. Open POS Session  
2. Select Table  
3. Add Products to Cart  
4. Send Order (Kitchen - planned)  
5. Proceed to Payment  
6. Choose Payment Method:
   - Cash
   - Card / Digital
   - UPI QR  
7. Confirm & Complete Order  

---

## 🔌 API Endpoints (Backend)

### Floors & Tables
- `GET /api/floors`
- `POST /api/floors`
- `GET /api/tables`
- `POST /api/tables`
- `PUT /api/tables/:id`
- `DELETE /api/tables/:id`

### Products & Categories
- `GET /api/categories`
- `POST /api/categories`
- `GET /api/products`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

### Orders
- `GET /api/orders`
- `POST /api/orders`
- `PUT /api/orders/:id`
- `PUT /api/orders/:id/items`

---

## 🛠️ Installation & Setup

### 1. Clone Repo
```bash
git clone <your-repo-url>
cd odoo-pos-cafe
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment
Create `.env` file:
```
DATABASE_URL="your_postgresql_url"
```

### 4. Run Backend
```bash
npm run server
```

### 5. Run Frontend
```bash
npm run dev
```

---

## ⚠️ Current Limitations

- Not all features are fully implemented
- No complete authentication system yet
- UI still under refinement
- Kitchen Display & Reports are partially done
- Error handling & validations are basic

---

## 🎯 Hackathon Goal

Build a **complete working POS system** with:
- Real-time ordering
- Multi-payment support
- Backend configuration
- Clean UI/UX flow

---

## 📌 Future Improvements

- Full authentication (JWT)
- Real-time updates (WebSockets)
- Better UI/UX polish
- Full reporting & analytics
- Deployment (Docker + Cloud)
- Performance optimizations

---

## 👤 Author

**Vrajraj Chauhan**  
Hackathon Project – Odoo POS Cafe

---

## ⭐ Note

This is a **hackathon project**, so some features are incomplete or simulated.  
Focus is on demonstrating full-stack architecture and POS workflow.
