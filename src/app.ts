/* eslint-disable @typescript-eslint/no-unsafe-call */
import express from 'express';
require('express-async-errors');

import config from './utils/config';
import dbConnection from './utils/connection';

// middleware
import cors from 'cors';
import morgan from 'morgan';
import errorHandler from './utils/errorHandler';
import jwt from 'express-jwt';

// routes
import loginRouter from './routes/login';
import userRouter from './routes/users';
import gameRouter from './routes/games';

const app = express();

void dbConnection.connect(config.MONGODB_URI);

// logger
if (process.env.NODE_ENV !== 'test') app.use(morgan('tiny'));

app.use(express.json());
app.use(cors());

app.use(express.static('build'));

// public routes
app.use('/api/login', loginRouter);
app.use('/api/users', userRouter);

// protected routes
app.use('/api/games', jwt({ secret: config.SECRET }), gameRouter);

app.use(errorHandler);

export default app;
