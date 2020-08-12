/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import express from 'express';

import {
  toNewGame,
  toAuthenticatedUser,
  toID,
  validateGameHost,
  validateGamePlayer,
  toPositiveInteger,
} from '../utils/mappers';

import expressJwt from 'express-jwt';
import jwt from 'jsonwebtoken';
import config from '../utils/config';

import Game from '../models/game';
import Word from '../models/word';
import Url from '../models/url';

import { Role } from '../types';

const router = express.Router();

/** public routes */

router.get('/join/:hostName/:playerId', async (req, res, next) => {
  try {
    const hostName = toID(req.params.hostName);
    const playerId = toID(req.params.playerId);
    const urlData = await Url.findOne({ hostName, playerId });

    if (!urlData) {
      throw new Error(
        `Invalid url: no game found with host name '${hostName}' and player ID '${playerId}'`
      );
    }

    const { gameId } = urlData;

    const game = await Game.findOne({ _id: gameId });
    const player = validateGamePlayer(game, playerId);

    const payload = {
      username: player.name,
      id: player.id,
      role: Role.PLAYER,
      gameId,
    };

    const token = jwt.sign(payload, config.SECRET);

    const response = { token, displayName: player.name };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

/** token protected routes */
router.use(expressJwt({ secret: config.SECRET }));

router.get('/', async (req, res, next) => {
  /** return all games where host id matches user token id */

  try {
    const user = toAuthenticatedUser(req);
    const allGames = await Game.find({ host: user.id });

    res.json(allGames);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const user = toAuthenticatedUser(req);
    const newGame = toNewGame(req.body, user.id);

    const game = new Game({
      ...newGame,
      createDate: new Date(),
    });

    const savedGame = await game.save();

    /** save short urls to database */
    for (const player of savedGame.players) {
      const urlObject = {
        playerId: player.id,
        gameId: savedGame._id.toString(),
        hostName: user.username,
      };

      const newUrl = new Url(urlObject);
      await newUrl.save();
    }

    res.json(savedGame);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const gameId = toID(req.params.id);
    const user = toAuthenticatedUser(req);

    const game = await Game.findById(gameId);

    const validatedGame = validateGameHost(game, user.id.toString());

    await validatedGame.remove();

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

/** random words */
router.get('/words/:amount', async (req, res, next) => {
  try {
    const amount = toPositiveInteger(req.params.amount);

    const words = await Word.aggregate().sample(amount);

    res.json(words);
  } catch (error) {
    next(error);
  }
});

export default router;
