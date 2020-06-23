import mongoose from 'mongoose';

const connect = async (MONGODB_URI: string): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    if (process.env.NODE_ENV !== 'test') console.log('Connected to MongoDB');
  } catch (error) {
    console.log('Error connecting to MongoDB:', error);
  }
};

const close = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
  } catch (error) {
    console.log('Error closing mongoDB connection');
  }
};

export default { connect, close };
