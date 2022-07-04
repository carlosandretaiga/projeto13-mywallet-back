import { getTransactions, createTransactions } from '../controllers/transactionsController.js';
import { Router } from 'express';

import validateUser from '../middlewares/validateUser.js';

const router = Router();

router.post('/transactions', createTransactions);
router.get('/transactions', validateUser, getTransactions);

export default router; 