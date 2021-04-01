import mongoose from 'mongoose';
import shortid from 'shortid';
import Game from '../models/game';
import { GameModel, GameStatus } from '../types';
import logger from '../utils/logger';
import gameService from './games';
import urlService from './urls';

const cancelReservation = async (hostName: string, inviteCode: string) => {
  const urlData = await urlService.getUrlData(hostName, inviteCode);

  const game = await gameService.getGameById(urlData.gameId);

  if (
    game.status === GameStatus.RUNNING ||
    game.status === GameStatus.FINISHED
  ) {
    throw new Error(`Invalid request: game already started`);
  }

  const newInviteCode = shortid.generate();

  let inviteCodeWasUpdated = false;

  game.players = game.players.map((player) => {
    if (player.privateData.inviteCode === inviteCode) {
      inviteCodeWasUpdated = true;

      return {
        ...player,
        privateData: {
          ...player.privateData,

          inviteCode: newInviteCode,
        },
        reservedFor: null,
        name: 'Avoinna',
      };
    }

    return player;
  });

  if (!inviteCodeWasUpdated) {
    throw new Error(`no player found matching inviteCode ${inviteCode}`);
  }

  await game.save();

  urlData.inviteCode = newInviteCode;

  await urlData.save();

  logger.log(`updated inviteCode ${inviteCode} to ${newInviteCode}`);
};

const refreshGameReservations = async (gameId: string): Promise<GameModel> => {
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

  return await game.save();
};

const reserveIfSpotOpen = async (
  gameId: string,
  reservationId: string,
  expiryTime: number
) => {
  await Game.updateOne(
    {
      _id: mongoose.Types.ObjectId(gameId),
      'players.reservedFor': null,
    },

    {
      $set: {
        'players.$.reservedFor': {
          id: reservationId,
          expires: expiryTime,
        },
      },
    }
  );

  const gameAfterUpdate = await gameService.getGameById(gameId);

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
    `reserved a spot for player id '${reservedPlayer.id}' (reservation id: ${reservationId})`
  );

  return {
    playerId: reservedPlayer.id,
    expiresAt: expiryTime,
  };
};

export default {
  cancelReservation,
  refreshGameReservations,
  reserveIfSpotOpen,
};
