import express from 'express';

import { toNewGame } from '../utils/mappers';

import Game from '../models/game';

const router = express.Router();

/** @TODO protect routes */

router.post('/', async (req, res, next) => {
  const newGame = toNewGame(req.body);

  const game = new Game({
    ...newGame,
    createDate: new Date(),
  });

  try {
    const savedGame = await game.save();
    res.json(savedGame);
  } catch (error) {
    next(error);
  }
});

export default router;
