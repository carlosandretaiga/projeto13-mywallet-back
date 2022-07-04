import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv'
import chalk from 'chalk';

dotenv.config();

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

const objectId = ObjectId;

export {db, objectId };