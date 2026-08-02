import { Router } from 'express';
import {
  getFinancialSummary,
  updateMonthlyBudget,
} from '../controllers/budgetController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateToken);

router.get('/summary', getFinancialSummary);
router.put('/monthly-target', updateMonthlyBudget);

export default router;
