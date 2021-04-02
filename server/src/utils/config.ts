import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const TEST_MONGODB_URI = process.env.TEST_MONGODB_URI;
const SECRET = process.env.SECRET;
const ADMIN_SECRET = process.env.ADMIN_SECRET;
const XIRSYS_SECRET = process.env.XIRSYS_SECRET;
const XIRSYS_URL = process.env.XIRSYS_URL;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_API_KEY = process.env.TWILIO_API_KEY;
const TWILIO_API_SECRET = process.env.TWILIO_API_SECRET;

if (!PORT) throw new Error('Port missing');
if (!MONGODB_URI) throw new Error('DB URI missing');
if (!TEST_MONGODB_URI) throw new Error('TEST-DB URI missing');
if (!SECRET) throw new Error('SECRET missing');
if (!ADMIN_SECRET) throw new Error('ADMIN_SECRET missing');
if (!XIRSYS_SECRET) throw new Error('XIRSYS_SECRET missing');
if (!XIRSYS_URL) throw new Error('XIRSYS_URL missing');
if (!SENDGRID_API_KEY) throw new Error('SENDGRID_API_KEY missing');
if (!TWILIO_API_SECRET) throw new Error('TWILIO_API_SECRET missing');
if (!TWILIO_ACCOUNT_SID) throw new Error('TWILIO_ACCOUNT_SID missing');
if (!TWILIO_API_KEY) throw new Error('TWILIO_API_KEY missing');

export default {
  PORT,
  MONGODB_URI: process.env.NODE_ENV === 'test' ? TEST_MONGODB_URI : MONGODB_URI,
  SECRET,
  ADMIN_SECRET,
  XIRSYS_SECRET,
  XIRSYS_URL,
  SENDGRID_API_KEY,
  TWILIO_API_KEY,
  TWILIO_ACCOUNT_SID,
  TWILIO_API_SECRET,
};
