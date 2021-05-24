import mongoose from 'mongoose';
import logger from './logger';

const connect = async (MONGODB_URI: string): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    if (process.env.NODE_ENV !== 'test') logger.log('Connected to MongoDB');
  } catch (error) {
    throw new Error(`Error connecting to MongoDB: ${error.message}`);
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
