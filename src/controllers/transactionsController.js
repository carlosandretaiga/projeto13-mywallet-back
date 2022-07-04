
import { db, objectId} from '../databases/mongo.js';
import joi from 'joi';
import dayjs from 'dayjs';
import chalk from 'chalk';

export async function createTransactions(request, response) {
  const transaction = request.body;

  const { authorization } = request.headers;
  const token = authorization?.replace('Bearer ', '');

  const transactionSchema = joi.object({
    type: joi.string().required(),
    value: joi.string().required(),
    description: joi.string().required()
  });

  const { error } = transactionSchema.validate(transaction);

  if(error) {
    return response.sendStatus(422);
  }

  const session = await db.collection('sessions').findOne({ token });

  if(!session) {
    return response.sendStatus(401);
  }

  await db.collection('transactions')
  .insertOne({ ...transaction, dayMonth: dayjs().format("DD/MM"), userId: session.userId});

  const transactions = await db.collection('transactions')
  .find({ userId: new objectId(session.userId) }).toArray();

  console.log(transactions);

  //const transactions = await { ...transaction, dayMonth: dayjs().format("DD/MM"), userId: session.userId}


  response.send(transactions);
  //response.status(201).send('Transaction created successfully', transactions);


}

export async function getTransactions(request, response) {

  const session = response.locals.session; 

  const transactions = await db
    .collection('transactions')
    .find({ userId: new objectId(session.userId) })
    .toArray();

  response.send(transactions);
}