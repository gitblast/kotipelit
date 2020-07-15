import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const TEST_MONGODB_URI = process.env.TEST_MONGODB_URI;
const SECRET = process.env.SECRET;
const ADMIN_SECRET = process.env.ADMIN_SECRET;
const JITSI_SECRET = process.env.JITSI_SECRET;

if (!PORT) throw new Error('Port missing');
if (!MONGODB_URI) throw new Error('DB URI missing');
if (!TEST_MONGODB_URI) throw new Error('TEST-DB URI missing');
if (!SECRET) throw new Error('SECRET missing');
if (!ADMIN_SECRET) throw new Error('ADMIN_SECRET missing');
if (!JITSI_SECRET) throw new Error('JITSI_SECRET missing');

export default {
  PORT,
  MONGODB_URI: process.env.NODE_ENV === 'test' ? TEST_MONGODB_URI : MONGODB_URI,
  SECRET,
  ADMIN_SECRET,
  JITSI_SECRET,
};
