import { Router } from 'express';
import {
  getIncomes,
  addIncome,
  updateIncome,
  deleteIncome,
} from '../controllers/incomeController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getIncomes);
router.post('/', addIncome);
router.put('/:id', updateIncome);
router.delete('/:id', deleteIncome);

export default router;
