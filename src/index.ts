/* eslint-disable import/newline-after-import,import/first,no-underscore-dangle,import/extensions */
import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import * as bodyParser from 'body-parser';
import { verify } from './jwt';
import { auth, photo, album } from './routes';

const port = Number(process.env.APPLICATION_PORT || 4000);

import { connect } from 'mongoose';
const mongoConnectionString = String(process.env.MONGO_URL);

const authMiddleware = (req: any, res: any, next: any) => {
  if (!req.headers.authorization) {
    res.send({ message: 'API Requires Authorization token' });
    return;
  }

  const decoded = verify(req.headers.authorization.replace('Bearer ', ''));
  if (!decoded) {
    res.send({ message: 'Token error' });
    return;
  }

  res.locals.user = decoded;
  next();
};

connect(mongoConnectionString)
  .then(() => {
    const app = express();
    app.use(bodyParser.json());

    app.use('/auth', auth);

    app.use(authMiddleware);

    app.use('/photo', photo);
    app.use('/album', album);

    app.listen(port, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
  });
