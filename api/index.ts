import express from 'express';
import { initDB } from '../server/config/db.js';
import { ensureDemoUser } from '../server/controllers/authController.js';
import authRoutes from '../server/routes/authRoutes.js';
import expenseRoutes from '../server/routes/expenseRoutes.js';
import incomeRoutes from '../server/routes/incomeRoutes.js';
import budgetRoutes from '../server/routes/budgetRoutes.js';
import aiRoutes from '../server/routes/aiRoutes.js';
import { errorHandler } from '../server/middleware/errorMiddleware.js';

const app = express();
app.use(express.json());

// Initialize database connection on cold start
let dbInitialized = false;
app.use(async (req, res, next) => {
  if (!dbInitialized) {
    try {
      await initDB();
      await ensureDemoUser();
      dbInitialized = true;
    } catch (err) {
      console.error('Failed to initialize DB in serverless context:', err);
    }
  }
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/incomes', incomeRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/ai', aiRoutes);

// Error Handler
app.use(errorHandler);

export default app;
