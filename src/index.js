import express from 'express';
import joi from 'joi';
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv'
import chalk from 'chalk';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import dayjs from 'dayjs';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
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
});


app.post('/sign-up', async (request, response) => {
  const user = request.body;

  const userShema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    confirmPassword: joi.ref('password')
  });

  const { error } = userShema.validate(user);

  if (error) {
    return response.sendStatus(422);
  }

  const passwordEncrypted = bcrypt.hashSync(user.password, 10);
  const confirmPasswordEncrypted = bcrypt.hashSync(user.confirmPassword, 10);


  await db.collection('users').insertOne({ ...user, password: passwordEncrypted, confirmPassword: confirmPasswordEncrypted});
  response.status(201).send("User created successfully!");

});

app.post('/sign-in', async (request, response) => {

  const loggedInUser = request.body;

  const loggedInUserSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
  });

  const { error } = loggedInUserSchema.validate(loggedInUser);

  if(error) {
    return response.sendStatus(422);
  }

  const userExistsDatabase = await db.collection('users').findOne({ email: loggedInUser.email});

  if(userExistsDatabase && bcrypt.compareSync(loggedInUser.password, userExistsDatabase.password)) {
    const token = uuid(); 

    await db.collection('sessions').insertOne({
      token,
      userId: userExistsDatabase._id
    });

    return response.status(201).send({ token});
  } else {
    return response.status(401).send("Incorrect password and/or email!");
  }
});

app.post('/transactions', async (request, response) => {
  const transaction = request.body;

  const { authorization } = request.headers;
  const token = authorization?.replace('Bearer ', '');

  const transactionSchema = joi.object({
    type: joi.string().required(),
    value: joi.string().required(),
    description: joi.string().required()
  });

  const { error } = transactionSchema.validate(transaction, {abortEarly: false});

  if(error) {
    return response.sendStatus(422);
  }

  const session = await db.collection('sessions').findOne({ token });

  if(!session) {
    return response.sendStatus(401);
  }

  await db.collection('transactions')
  .insertOne({ ...transaction, dayMonth: dayjs().format("DD/MM"), userId: session.userId});
  response.status(201).send('Transaction created successfully');

});

const PORT = process.env.PORT || 5008
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});