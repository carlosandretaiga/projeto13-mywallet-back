import express from 'express';


import cors from 'cors';
import dotenv from 'dotenv'
import chalk from 'chalk';

import dayjs from 'dayjs';

import { loginUser, createUser } from './controllers/userController.js';
import { getTransactions, createTransactions } from './controllers/transactionsController.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());


app.post('/sign-up', createUser);

app.post('/sign-in', loginUser);

app.post('/transactions', createTransactions);

app.get('/transactions', getTransactions);



const PORT = process.env.PORT || 5008
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});