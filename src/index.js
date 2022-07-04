import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import chalk from 'chalk';
import transactionsRouter from './routes/transactionsRouter.js';
import authRouter from './routes/authRouter.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use(authRouter);
app.use(transactionsRouter);

const PORT = process.env.PORT || 5008
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});