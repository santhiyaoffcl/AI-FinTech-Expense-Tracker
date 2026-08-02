<div align="center">

# AI FinTech Expense Tracker

A high-performance, interactive financial dashboard showcasing smart budgeting, financial analytics, and Gemini-powered insights.

<p align="center">
  <img src="https://img.shields.io/badge/deployed%20on-vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Deployed on Vercel" />
  <img src="https://img.shields.io/badge/react%2019-20232a?style=for-the-badge&logo=react&logoColor=61dafb" alt="React 19" />
  <img src="https://img.shields.io/badge/tailwind%20css-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
</p>

🔴 **[View Live Demo](https://github.com/santhiyaoffcl/AI-FinTech-Expense-Tracker)**

</div>

---

## 🚀 Features

- **Smart Dashboard**: Visual representation of your financial health with interactive charts and key metrics.
- **AI Spending Insights**: Get real-time, personalized financial recommendations and category analysis using Google Gemini.
- **Budget Management**: Set monthly limits and receive automated warnings when spending approaches or exceeds targets.
- **Income & Expense Tracking**: Categorize, edit, and keep detailed notes on cash flows.
- **Seamless Database Fallback**: Built with a hybrid storage engine that automatically connects to MongoDB Atlas or falls back to local file storage (`db.json`) if offline.
- **Secure Authentication**: JWT-based user login and registration with encrypted passwords using `bcryptjs`.
- **Premium User Experience**: Sleek UI with smooth animations, dark-mode styling, and fully responsive layouts.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Charts & Visuals**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [GSAP](https://gsap.com/) & [Motion (Framer Motion)](https://motion.dev/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (executed via `tsx` in development)
- **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/) & [bcryptjs](https://github.com/dcodeIO/bcrypt.js)

### Database & AI
- **Primary Database**: [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Local Fallback**: File-based JSON database (`data/db.json`)
- **AI Integration**: [Google Gemini API](https://ai.google.dev/) (using `@google/genai` SDK)

---

## 📁 Project Structure

```text
├── data/                  # Local JSON database storage (Git-ignored)
├── server/                # Backend code
│   ├── config/            # DB configuration & initialization
│   ├── controllers/       # Route controller logic (Auth, Expense, Income, AI)
│   ├── middleware/        # JWT validation and error handlers
│   └── routes/            # API endpoints mapping
├── src/                   # React Frontend application
│   ├── components/        # Reusable UI elements (Navbar, Sidebar, Modals, etc.)
│   ├── context/           # React Context (Auth State)
│   ├── pages/             # View components (Dashboard, Analytics, Insights, etc.)
│   └── services/          # API communication client
├── server.ts              # Entry point linking Express backend and Vite frontend dev server
├── tsconfig.json          # TypeScript configurations
└── vite.config.ts         # Vite build configuration
```

---

## ⚙️ Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [NPM](https://www.npmjs.com/) or [Bun](https://bun.sh/) package manager

### 1. Clone the Repository
```bash
git clone https://github.com/santhiyaoffcl/AI-FinTech-Expense-Tracker.git
cd AI-FinTech-Expense-Tracker
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory (you can use `.env.example` as a template):

```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
JWT_SECRET="your_jwt_signing_secret_key"
MONGODB_URI="your_mongodb_atlas_connection_string"
MONGODB_DB_NAME="Fintech_AI"
```

*Note: If the application cannot connect to MongoDB Atlas, it will automatically fall back to using local storage in `data/db.json` so you can test features instantly.*

### 4. Run the Application
Start the development server (runs both Vite frontend and Express backend):
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 API Documentation

### Auth
- `POST /api/auth/register` - Create a new user account.
- `POST /api/auth/login` - Authenticate user and receive a JWT.
- `GET /api/auth/me` - Fetch authenticated user details.

### Expenses
- `GET /api/expenses` - Retrieve all expenses.
- `POST /api/expenses` - Log a new expense.
- `DELETE /api/expenses/:id` - Delete an expense record.

### Income
- `GET /api/incomes` - Retrieve all income logs.
- `POST /api/incomes` - Log new income.
- `DELETE /api/incomes/:id` - Delete an income record.

### Budget
- `GET /api/budget` - Fetch current budget limit.
- `PUT /api/budget` - Update monthly budget.

### AI Insights
- `POST /api/ai/insights` - Send transaction history to Gemini and get spending analysis.
