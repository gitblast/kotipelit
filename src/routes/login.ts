import express from 'express';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.get('/', async (_req, res) => {
  const hash = await bcrypt.hash('test', 10);
  const correct = await bcrypt.compare('test', hash);
  res.send(`Password ${correct.toString()}`);
});

export default router;
