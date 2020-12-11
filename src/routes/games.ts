/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import express from 'express';
import shortid from 'shortid';

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
import mongoose from 'mongoose';

import Game from '../models/game';
import Word from '../models/word';
import Url from '../models/url';
import User from '../models/user';

import { GameStatus, Role, WordModel } from '../types';
import { onlyForRole } from '../utils/middleware';
import logger from '../utils/logger';

const router = express.Router();

/** public routes */

router.put('/reserve', async (req, res, next) => {
  try {
    const gameId = toID(req.body.gameId);

    const game = await Game.findById(gameId);

    if (!game) {
      throw new Error(`Invalid request: no game found with id ${gameId}`);
    }

    if (game.status !== GameStatus.UPCOMING) {
      throw new Error(`Invalid request: game status is not upcoming`);
    }

    game.players = game.players.map((player) => {
      return player.reservedFor &&
        !player.reservedFor.locked &&
        player.reservedFor.expires < Date.now()
        ? {
            ...player,
            reservedFor: null,
          }
        : player;
    });

    await game.save();

    const reservationId = toID(req.body.reservationId);

    const expiresAt = Date.now() + 300000; // 5 min

    await Game.updateOne(
      {
        _id: mongoose.Types.ObjectId(gameId),
        'players.reservedFor': null,
      },

      {
        $set: {
          'players.$.reservedFor': {
            id: reservationId,
            expires: expiresAt,
          },
        },
      }
    );

    const gameAfterUpdate = await Game.findById(gameId);

    if (!gameAfterUpdate) {
      throw new Error(
        `Unexpected error: no game found after update with id ${gameId}`
      );
    }

    const reservations = gameAfterUpdate.players.map((player) =>
      player.reservedFor ? player.reservedFor.id : null
    );

    if (!reservations.includes(reservationId)) {
      if (reservations.indexOf(null) === -1) {
        throw new Error('Invalid request: game is full');
      }

      throw new Error('Unexpected error reserving');
    }

    const reservedPlayer = gameAfterUpdate.players.find(
      (player) => player.reservedFor?.id === reservationId
    );

    if (!reservedPlayer) {
      throw new Error(
        'Unexpected error reserving, reserved player was undefined'
      );
    }

    logger.log(
      'reserved a slot with id',
      reservationId,
      'player id:',
      reservedPlayer.id,
      'expires at:',
      expiresAt
    );

    res.json({
      playerId: reservedPlayer.id,
      expiresAt,
    });
  } catch (e) {
    next(e);
  }
});

router.get('/join/:hostName/:inviteCode', async (req, res, next) => {
  try {
    const rtc = req.query.rtc;

    const hostName = toID(req.params.hostName);
    const inviteCode = toID(req.params.inviteCode);

    const urlData = await Url.findOne({ hostName, inviteCode });

    if (!urlData) {
      throw new Error(
        `Invalid url: no game found with host name '${hostName}' and invite code '${inviteCode}'`
      );
    }

    const { gameId } = urlData;

    const game = await Game.findOne({ _id: gameId });
    const player = validateGamePlayer(game, inviteCode);

    const payload = {
      username: player.name,
      id: player.id,
      role: Role.PLAYER,
      gameId,
      type: rtc ? 'rtc' : 'jitsi',
    };

    const token = jwt.sign(payload, config.SECRET);

    const response = rtc ? token : { token, displayName: player.name };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

router.get('/lobby/:hostName/:gameId', async (req, res, next) => {
  try {
    const gameId = toID(req.params.gameId);
    const hostName = toID(req.params.hostName);

    const game = await Game.findById(gameId);

    if (!game) {
      throw new Error(`Invalid request: no game found with id ${gameId}`);
    }

    if (game.status !== GameStatus.UPCOMING) {
      throw new Error(`Invalid request: game status is not upcoming`);
    }

    const host = await User.findOne({ username: hostName });

    if (!host || game.host.toString() !== host._id.toString()) {
      throw new Error(
        `Invalid request: host missing or not matching fetched game`
      );
    }

    const response = {
      type: game.type,
      price: game.price,
      hostName: hostName,
      startTime: game.startTime,
      players: game.players.map((player) => {
        return {
          id: player.id,
          name: player.name,
          expires: player.reservedFor ? player.reservedFor.expires : null,
          locked: !!player.reservedFor?.locked,
        };
      }),
    };

    res.json(response);
  } catch (e) {
    next(e);
  }
});

/** token protected routes */
router.use(expressJwt({ secret: config.SECRET }), onlyForRole(Role.HOST));

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
      players: newGame.players.map((player) => {
        return {
          ...player,
          id: shortid.generate(),
          inviteCode: shortid.generate(),
          reservedFor: null,
        };
      }),
    });

    const savedGame = await game.save();

    /** save short urls to database */
    for (const player of savedGame.players) {
      if (!player.inviteCode) {
        throw new Error(`Player ${player.name} has no invite code set`);
      }

      const urlObject = {
        playerId: player.id,
        gameId: savedGame._id.toString(),
        hostName: user.username,
        inviteCode: player.inviteCode,
      };

      const newUrl = new Url(urlObject);
      await newUrl.save();
    }

    res.json(savedGame);
  } catch (error) {
    next(error);
  }
});

router.get('/token/:id', async (req, res, next) => {
  try {
    const gameId = toID(req.params.id);

    const game = await Game.findById(gameId);

    if (!game) {
      throw new Error(`Invalid game id: ${gameId}`);
    }

    const user = toAuthenticatedUser(req);

    if (!user.id === game.host) {
      console.error('invalid host', game.host, user.id);

      throw new Error(
        `Invalid request: game host id and request user id not matching`
      );
    }

    const payload = {
      username: user.username,
      id: user.id,
      role: Role.HOST,
      gameId,
      type: 'rtc',
    };

    const token = jwt.sign(payload, config.SECRET);

    res.json(token);
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

    const words = await Word.aggregate<WordModel>().sample(amount);

    res.json(words.map((word) => word.word));
  } catch (error) {
    next(error);
  }
});

export default router;
