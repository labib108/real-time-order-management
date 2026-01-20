# 🚀 Real-time Order Management System

A professional, high-performance order management platform built with **Next.js 15**, **Socket.IO**, and **Prisma**. This system provides real-time updates, intelligent data fetching, and a stunning administrative interface for managing orders, products, and customers.

## ✨ Features

### 💻 Login
Login page with email and password.
![Dashboard Overview](./screenshots/login.png)

### 💻 Professional Dashboard
Monitor your business at a glance with real-time statistics and revenue charts.
![Dashboard Overview](./screenshots/dashboard.png)

### 📦 Order Management
Full lifecycle management from 'Pending' to 'Delivered'.
- **Real-time Sync**: Orders appear and update instantly across all connected clients via WebSockets.
- **Optimistic UI**: Immediate feedback for status changes with automatic rollback on failure.
- **Advanced Filtering**: Search, filter by status/date, and multi-column sorting.
![Orders List](./screenshots/orders.png)

### 🔍 Detailed Order Insights
View itemized breakdowns, customer information, and status history.
- **Dynamic Creation**: A robust "Create Order" form with real-time validation and multi-product support.
![Order Details](./screenshots/order-details.png)

### 🏬 Inventory & Customer Control
- **Product Management**: Track stock levels with automated status badges (In Stock, Low Stock, Out of Stock).
- **Customer Directory**: Manage user roles and access from a centralized view.
![Products Management](./screenshots/products.png)
![Customers Directory](./screenshots/customers.png)

### ⚙️ Account & Application Settings
Configurable profile and security settings for administrators.
![Settings Page](./screenshots/settings.png)

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Actions)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **State Management**: [TanStack Query v5](https://tanstack.com/query/latest)
- **Real-time**: [Socket.IO](https://socket.io/) (Standalone Server)
- **Database**: [MySQL](https://www.mysql.com/) via [Prisma ORM](https://www.prisma.io/)
- **Validation**: [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/)
- **Auth**: [JWT](https://jwt.io/) (Stateless Authentication)

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+
- MySQL Server

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
DATABASE_URL="mysql://root:password@localhost:3306/order_management"
JWT_SECRET="your_secure_random_secret"
```

### 3. Installation
```bash
npm install
```

### 4. Database Setup
```bash
npx prisma db push
npx tsx scripts/seed-data.ts
```

### 5. Running the Application
You need to run BOTH the Next.js dev server and the standalone Socket.IO server:

**Terminal 1 (Next.js):**
```bash
npm run dev
```

**Terminal 2 (Socket Server):**
```bash
npx tsx scripts/socket-server.ts
```

## 🏗️ Architecture

- **Standalone Socket Server**: Decoupled from the Next.js runtime for maximum stability and performance on port `3001`.
- **Intelligent Invalidation**: Uses TanStack Query to perform "precision updates" on the UI without reloading.
- **Domain-Driven Features**: Code organized by feature area (auth, dashboard, orders) for better maintainability.

---

