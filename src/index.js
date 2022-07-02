import express from 'express';
import joi from 'joi';
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv'
import chalk from 'chalk';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

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

const PORT = process.env.PORT || 5008
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});