# 🚀 VyaparSathi AI (व्यापार साथी AI)

> **Next-Generation MSME Business Operating System with Smart Billing, Real-Time Inventory, Live P&L Finance, GST Compliance, and AI Business Copilot.**

![Angular 17](https://img.shields.io/badge/Angular-17%2B-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-REST%20API-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2%2B-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/Neon%20DB-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4%2B-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-AI%20Copilot-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)

---

## 🌟 Overview

**VyaparSathi AI** is a comprehensive, production-grade Web Application built specifically for Indian Kirana Stores, Retailers, and Small-to-Medium Enterprises (MSMEs). It bridges modern cloud infrastructure with intuitive MSME business operations—offering zero-friction billing, stock reorder alerts, cash-flow analytics, and an intelligent Hinglish AI business copilot.

---

## ✨ Key Features

### 🔐 1. Multi-Tenant Account Security & Clean Slate Policy
- **Account Isolation**: Every business starts with a 100% clean-slate account (₹0 Sales, 0 Stock, ₹0 Profit). Zero dummy data collisions!
- **Strict Auth Options**: Tabbed Sign In / Sign Up supporting unique Business Name, Mobile Number/Email, Username, and Password authentication.

### 📦 2. Smart Inventory Management
- Real-time stock tracking with SKU, selling price, cost price, and GST rates.
- **Automated Low-Stock Alerts**: Instant notification when stock drops below threshold (min stock = 5).

### 🧾 3. Customer Billing & Invoices
- Quick GST Invoice generation with automated Subtotal and CGST/SGST tax calculation.
- **Invoice Payment Tracking**: Mark invoices as **`PAID`** with permanent status persistence.

### 💰 4. Live Finance & Profit & Loss Statement
- Track operating expenses (Shop Rent, Electricity, Staff Salary).
- Live calculation of **Gross Sales - Operating Expenses** to display Net Profit and Profit Margin (%).

### 📑 5. GST Tax Compliance & Return Filing
- Automatic tax breakdown into **CGST (Central Tax)** and **SGST (State Tax)** liabilities.
- Export-ready layout for GSTR-1 filing.

### 🤖 6. AI Business Assistant (Hinglish Advisor)
- Integrated **Google Gemini LLM** Business Copilot.
- Reads live store database metrics to answer questions in natural Hinglish (*"Bill kaise banayein?"*, *"Mera profit kitna hai?"*, *"Stock check karo"*).

---

## 🛠️ Technology Stack

| Layer | Technology Used |
| :--- | :--- |
| **Frontend** | Angular 17+ (Standalone Components, Signals, Reactive Forms) |
| **Styling** | Tailwind CSS (Custom `#7342E2` Password Manager Theme) |
| **Backend API** | Node.js REST API Server / Java Spring Boot 3.2+ |
| **Database** | Serverless Neon PostgreSQL Cloud DB with Flyway Migrations |
| **AI Integration** | Google Gemini 1.5 Flash LLM API |

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- Node.js `v18+`
- npm `v9+`

### 1. Clone Repository
```bash
git clone https://github.com/spideyWebb/vyaparsathi-ai.git
cd vyaparsathi-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Backend API Server (Port 8081)
```bash
node backend/server.js
```

### 4. Run Angular Dev Server (Port 4200)
```bash
npx ng serve --port 4200
```
Open `http://localhost:4200` in your browser!

---

## 🌐 Production Deployment

- **Frontend Deployment**: Deployed as an Angular SPA on **[Vercel](https://vercel.com/)** using `vercel.json`.
- **Backend Deployment**: Deployed on **[Render](https://render.com/)** connected to **Neon Cloud PostgreSQL**.

---

## 🔒 Security & Environment Variables

Environment variables are sanitized in production. Duplicate `.env.example` to `.env` to configure your keys:

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://your-neon-db-url:5432/neondb?sslmode=require
SPRING_DATASOURCE_USERNAME=your_username
SPRING_DATASOURCE_PASSWORD=your_password
GEMINI_API_KEY=AIzaSy_your_gemini_key
```

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.
