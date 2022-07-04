import { db } from '../databases/mongo.js';

async function validateUser(request, response, next) {

  const { authorization } = request.headers;
  const token = authorization?.replace('Bearer ', '');

  const session = await db.collection('sessions').findOne({ token });

  if(!session) {
    return response.sendStatus(401);
  }

  response.locals.session = session; 

  next();

}

export default validateUser;