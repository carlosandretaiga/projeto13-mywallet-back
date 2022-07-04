
//import { MongoClient, ObjectId } from 'mongodb';
import { db, objectId} from '../databases/mongo.js';
import joi from 'joi';
//import bcrypt from 'bcrypt';
//import { v4 as uuid } from 'uuid';
//import dotenv from 'dotenv'

import dayjs from 'dayjs';
import chalk from 'chalk';

/* dotenv.config();

const database = process.env.MONGO_DATABASE;
let db = null;
const mongoClient = new MongoClient(process.env.MONGO_URL);
const promise = mongoClient.connect();
promise.then(() => {
  db = mongoClient.db(database);
  console.log(chalk.blue.bold("Database connection is working!"))
});
promise.catch((error) => {
  console.log(chalk.red.bold("An error occurred, did not connect to Mongo!"));
});  */
 
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
 /*  const { authorization } = request.headers;
  const token = authorization?.replace('Bearer ', ''); */

/*   const session = await db.collection('sessions').findOne({ token });

  if(!session) {
    return response.sendStatus(401);
  } */

  const session = response.locals.session; 

  const transactions = await db
    .collection('transactions')
    .find({ userId: new objectId(session.userId) })
    .toArray();

  response.send(transactions);
}