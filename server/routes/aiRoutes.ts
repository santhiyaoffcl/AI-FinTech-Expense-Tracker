import { Router } from 'express';
import { getSmartInsights } from '../controllers/aiController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateToken);

router.get('/insights', getSmartInsights);

export default router;
