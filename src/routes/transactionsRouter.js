import { getTransactions, createTransactions } from '../controllers/transactionsController.js';
import { Router } from 'express';

const router = Router();

router.post('/transactions', createTransactions);
router.get('/transactions', getTransactions);

export default router; 