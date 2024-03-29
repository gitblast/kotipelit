import express from 'express';

import {
  toNewGame,
  toAuthenticatedUser,
  toID,
  validateGameHost,
  validateGamePlayer,
  toPositiveInteger,
  parseString,
  parseEmail,
} from '../utils/mappers';

import jwt from 'jsonwebtoken';
import config from '../utils/config';

import gameService from '../services/games';
import urlService from '../services/urls';
import mailService from '../services/mail';
import userService from '../services/users';
import wordService from '../services/words';
import lobbyService from '../services/lobby';
import twilioService from '../services/twilio';

import { Role, SocketIOGameToken } from '../types';
import { onlyForRole, verifyToken } from '../utils/middleware';
import { getInviteMailData } from '../utils/helpers';
import logger from '../utils/logger';

const router = express.Router();

/** public routes */

router.put('/lock', async (req, res, next) => {
  try {
    const gameId = parseString(req.body.gameId);
    const reservationId = parseString(req.body.reservationId);
    const displayName = parseString(req.body.displayName);

    if (displayName.length > 10) {
      throw new Error('Invalid request: display name max length is 10');
    }

    const email = parseEmail(req.body.email);

    const game = await gameService.getGameById(gameId);

    const host = await userService.getUserById(game.host.id.toString());

    const playerReservationToLock = game.players.find((player) => {
      return player.reservedFor?.id === reservationId;
    });

    if (!playerReservationToLock?.reservedFor) {
      throw new Error(
        `Invalid request: no reservation found with id '${reservationId}'`
      );
    }

    const reservationData = playerReservationToLock.reservedFor;

    // 10 sec buffer to make sure gameservice won't set spot as null in 10 seconds to avoid race conditions
    if (reservationData.expires - 10000 < Date.now()) {
      throw new Error(
        `Invalid request: reservation with id '${reservationId}' has expired`
      );
    }

    if (reservationData.locked) {
      throw new Error(
        `Invalid request: reservation with id '${reservationId}' is locked`
      );
    }

    logger.log(
      `locking reservation with id ${reservationId} and setting displayName '${displayName}'`
    );

    const playerWithReservationLocked = {
      ...playerReservationToLock,
      name: displayName.trim(),
      reservedFor: {
        ...reservationData,
        locked: true,
      },
    };

    game.players = game.players.map((player) => {
      if (player.id === playerReservationToLock.id) {
        return playerWithReservationLocked;
      }

      return player;
    });

    const savedGame = await game.save();

    res.json(playerWithReservationLocked);

    const inviteMailData = getInviteMailData(
      savedGame,
      playerWithReservationLocked.id,
      displayName,
      host.username
    );

    await mailService.sendInvite(email, inviteMailData);
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    logger.error(`error locking spot: ${e.message}`);
    next(e);
  }
});

router.put('/reserve', async (req, res, next) => {
  try {
    const gameId = toID(req.body.gameId);

    const reservationId = toID(req.body.reservationId);

    await lobbyService.refreshGameReservations(gameId);

    const expiresAt = Date.now() + 300000 + 10000; // 5 min + 10 sec buffer

    const reservationData = await lobbyService.reserveIfSpotOpen(
      gameId,
      reservationId,
      expiresAt
    );

    res.json(reservationData);
  } catch (e) {
    next(e);
  }
});

router.get('/cancel/:hostName/:inviteCode', async (req, res, next) => {
  try {
    const hostName = toID(req.params.hostName);
    const inviteCode = toID(req.params.inviteCode);

    await lobbyService.cancelReservation(hostName, inviteCode);

    res.status(204).end();
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    logger.error(`error canceling reservation: ${e.message}`);
    next(e);
  }
});

router.get('/spectate/:gameId', async (req, res, next) => {
  try {
    const gameId = toID(req.params.gameId);

    // check that game exists
    const game = await gameService.getGameById(gameId);

    if (game.allowedSpectators === 0) {
      throw new Error('Invalid request: game allows no spectators');
    }

    // check if there is room
    const participants = await twilioService.getParticipantList(gameId);

    logger.log(
      `${participants.length} participants connected to game id '${gameId}'`
    );

    if (participants.length - 6 >= game.allowedSpectators) {
      // -6 because 1 host, 5 players

      throw new Error('Invalid request: max spectator count full');
    }

    const spectatorId = `spectator-${Date.now()}`;

    const payload: SocketIOGameToken = {
      username: spectatorId,
      id: spectatorId,
      role: Role.SPECTATOR,
      gameId,
    };

    const token = jwt.sign(payload, config.SECRET, { expiresIn: '10h' });

    res.json(token);
  } catch (e) {
    logger.error(e.message);

    next(e);
  }
});

router.get('/join/:hostName/:inviteCode', async (req, res, next) => {
  try {
    const hostName = toID(req.params.hostName);
    const inviteCode = toID(req.params.inviteCode);

    const { gameId } = await urlService.getUrlData(hostName, inviteCode);

    const game = await gameService.getGameById(gameId);
    const player = validateGamePlayer(game, inviteCode);

    const payload: SocketIOGameToken = {
      username: player.name,
      id: player.id,
      role: Role.PLAYER,
      gameId,
    };

    const token = jwt.sign(payload, config.SECRET, { expiresIn: '10h' });

    const response = token;

    res.json(response);
  } catch (error) {
    next(error);
  }
});

router.get('/lobby/:hostName/:gameId', async (req, res, next) => {
  try {
    const gameId = toID(req.params.gameId);
    const hostName = toID(req.params.hostName);

    const game = await lobbyService.refreshGameReservations(gameId);

    const host = await userService.getUserByUsername(hostName);

    if (game.host.id.toString() !== host._id.toString()) {
      throw new Error(
        `Invalid request: host username not matching fetched game`
      );
    }

    const response = {
      id: game.id,
      type: game.type,
      price: game.price,
      allowedSpectators: game.allowedSpectators,
      hostName: hostName,
      startTime: game.startTime,
      players: game.players.map((player) => {
        return {
          id: player.id,
          name: player.name,
          reservedFor: player.reservedFor,
        };
      }),
    };

    res.json(response);
  } catch (e) {
    next(e);
  }
});

/** token protected routes */
router.use(verifyToken, onlyForRole(Role.HOST));

router.get('/', async (req, res, next) => {
  /** return all games where host id matches user token id */

  try {
    const user = toAuthenticatedUser(req);
    const userGames = await gameService.getAllGamesByUser(user.id.toString());

    res.json(userGames);
  } catch (error) {
    next(error);
  }
});

router.get('/:gameId', async (req, res, next) => {
  try {
    const gameId = toID(req.params.gameId);
    const user = toAuthenticatedUser(req);

    const game = await gameService.getGameById(gameId);

    if (game.host.id.toString() !== user.id.toString()) {
      throw new Error('game host id and user id not matching');
    }

    res.json(game);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const user = toAuthenticatedUser(req);
    const newGame = toNewGame(req.body, user);

    const savedGame = await gameService.addGame(newGame);

    await urlService.createPlayerUrls(savedGame, user.username);

    res.json(savedGame);
  } catch (error) {
    next(error);
  }
});

router.get('/token/:id', async (req, res, next) => {
  try {
    const gameId = toID(req.params.id);

    const game = await gameService.getGameById(gameId);

    const user = toAuthenticatedUser(req);

    if (user.id.toString() !== game.host.id.toString()) {
      throw new Error(
        `Invalid request: game host id and request user id not matching`
      );
    }

    const payload: SocketIOGameToken = {
      username: user.username,
      id: user.id.toString(),
      role: Role.HOST,
      gameId,
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

    const game = await gameService.getGameById(gameId);

    const validatedGame = validateGameHost(game, user.id.toString());

    await validatedGame.remove();

    // delete urls
    await urlService.deleteGameUrls(gameId);

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

/** random words */
router.post('/words/:amount', async (req, res, next) => {
  try {
    const amount = toPositiveInteger(req.params.amount);

    const excludedWords: string[] = req.body.excludedWords ?? [];

    const words = await wordService.getRandomWords(amount, excludedWords);

    res.json(words);
  } catch (error) {
    next(error);
  }
});

export default router;
