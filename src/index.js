import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import chalk from 'chalk';
import transactionsRouter from './routes/transactionsRouter.js';
import authRouter from './routes/authRouter.js';
//import validateUser from './middlewares/validateUser.js';

//import dayjs from 'dayjs';

/* import { loginUser, createUser } from './controllers/authController.js';
import { getTransactions, createTransactions } from './controllers/transactionsController.js';
 */
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

/* app.use(validateUser); */

app.use(authRouter);
app.use(transactionsRouter);


/* app.post('/sign-up', createUser);
app.post('/sign-in', loginUser); */

/* app.post('/transactions', createTransactions);
app.get('/transactions', getTransactions); */

const PORT = process.env.PORT || 5008
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});