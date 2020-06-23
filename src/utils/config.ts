import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const TEST_MONGODB_URI = process.env.TEST_MONGODB_URI;
const SECRET = process.env.SECRET;

if (!PORT) throw new Error('Port missing');
if (!MONGODB_URI) throw new Error('DB URI missing');
if (!TEST_MONGODB_URI) throw new Error('TEST-DB URI missing');
if (!SECRET) throw new Error('SECRET missing');

export default {
  PORT,
  MONGODB_URI: process.env.NODE_ENV === 'test' ? TEST_MONGODB_URI : MONGODB_URI,
  SECRET,
};
