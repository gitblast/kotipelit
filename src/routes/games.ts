import express from 'express';

import {
  toNewGame,
  toAuthenticatedUser,
  toID,
  validateGameHost,
} from '../utils/mappers';

import Game from '../models/game';

const router = express.Router();

router.get('/', async (req, res) => {
  /** return all games where host id matches user token id */

  const user = toAuthenticatedUser(req);
  const allGames = await Game.find({ host: user.id });

  res.json(allGames);
});

router.post('/', async (req, res, next) => {
  const user = toAuthenticatedUser(req);
  const newGame = toNewGame(req.body, user.id);

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

router.delete('/:id', async (req, res, next) => {
  const gameId = toID(req.params.id);
  const user = toAuthenticatedUser(req);

  try {
    const game = await Game.findById(gameId);

    const validatedGame = validateGameHost(game, user.id.toString());

    await validatedGame.remove();

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;
