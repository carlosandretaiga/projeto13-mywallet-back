

import {db, objectId} from '../databases/mongo.js';
import joi from 'joi';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

export async function createUser(request, response) {
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

}

export async function loginUser(request, response) {

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

  const transactionsExistsDatabase = await db.collection('transactions')
  .find({ userId: new objectId(userExistsDatabase._id) }).toArray();
  

  const UserName = {
    name: userExistsDatabase.name
  }; 


  if(userExistsDatabase && bcrypt.compareSync(loggedInUser.password, userExistsDatabase.password)) {
    const token = uuid(); 

    await db.collection('sessions').insertOne({
      token,
      userId: userExistsDatabase._id
    });

    return response.status(201).send({ token, UserName, transactionsExistsDatabase});
  } else {
    return response.status(401).send("Incorrect password and/or email!");
  }

}