/* eslint-disable @typescript-eslint/no-unsafe-call */
import express from 'express';
require('express-async-errors');

import mongoose from 'mongoose';

import config from './utils/config';

// middleware
import cors from 'cors';
import morgan from 'morgan';

// routes
import loginRouter from './routes/login';
import userRouter from './routes/users';

const app = express();

const { MONGODB_URI } = config;

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error: mongoose.Error) =>
    console.log('Error connecting to MongoDB:', error.message)
  );

mongoose.set('useCreateIndex', true);

app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());

app.use(express.static('build'));
app.use('/api/login', loginRouter);
app.use('/api/users', userRouter);

export default app;
