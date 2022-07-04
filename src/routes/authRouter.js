import { loginUser, createUser } from '../controllers/authController.js';
import { Router } from 'express';

const router = Router();

router.post('/sign-up', createUser);
router.post('/sign-in', loginUser);

export default router; 