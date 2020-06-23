/* eslint-disable @typescript-eslint/no-unsafe-call */
import express from 'express';
require('express-async-errors');

import config from './utils/config';
import dbConnection from './utils/connection';

// middleware
import cors from 'cors';
import morgan from 'morgan';
import errorHandler from './utils/errorHandler';

// routes
import loginRouter from './routes/login';
import userRouter from './routes/users';

const app = express();

const { MONGODB_URI } = config;

void dbConnection.connect(MONGODB_URI);

if (process.env.NODE_ENV !== 'test') app.use(morgan('tiny'));

app.use(express.json());
app.use(cors());

app.use(express.static('build'));
app.use('/api/login', loginRouter);
app.use('/api/users', userRouter);

app.use(errorHandler);

export default app;
