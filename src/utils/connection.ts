import mongoose from 'mongoose';
import logger from './logger';

const connect = async (MONGODB_URI: string): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    if (process.env.NODE_ENV !== 'test') logger.log('Connected to MongoDB');
  } catch (error) {
    logger.log('Error connecting to MongoDB:', error);
  }
};

const close = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
  } catch (error) {
    logger.log('Error closing mongoDB connection');
  }
};

export default { connect, close };
