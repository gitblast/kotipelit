import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

if (!PORT) throw new Error('Port missing');
if (!MONGODB_URI) throw new Error('DB URI missing');

export default {
  PORT,
  MONGODB_URI,
};
