import { RTCGame, SocketWithToken, Role, FilteredRTCGame } from '../../types';
import logger from '../../utils/logger';
import gameService from '../games';

const rooms = new Map<string, RTCGame>();

const joinRoom = (socket: SocketWithToken): RTCGame | FilteredRTCGame => {
  const { role, gameId, id, username } = socket.decodedToken;

  const game = rooms.get(gameId);

  if (!game) {
    throw new Error(`No room found with id ${gameId}`);
  }

  logger.log(`joining ${role} (${username}) to room ${gameId}`);

  switch (role) {
    case Role.HOST: {
      const newGame = {
        ...game,
        host: {
          id,
          socketId: socket.id,
        },
      };

      rooms.set(gameId, newGame);

      return newGame;
    }
    case Role.PLAYER: {
      const newGame = {
        ...game,
        players: game.players.map((player) => {
          return player.id === id
            ? {
                ...player,
                privateData: { ...player.privateData, socketId: socket.id },
              }
            : player;
        }),
      };

      rooms.set(gameId, newGame);

      return gameService.filterGameForUser(newGame, id);
    }
    default: {
      throw new Error('No role set for token!');
    }
  }
};

const getRoomGame = (id: string): RTCGame | null => {
  const room = rooms.get(id);

  return room ?? null;
};

const createRoom = (game: RTCGame): void => {
  const existing = rooms.get(game.id);

  if (existing) {
    throw new Error(`Room with id ${game.id} already exists.`);
  }

  logger.log(`creating room for game ${game.id}`);

  rooms.set(game.id, game);
};

const leaveRoom = (gameId: string, userId: string): void => {
  const game = rooms.get(gameId);

  if (game) {
    if (userId === game.host.id) {
      logger.log(`host left`);

      const newGame = {
        ...game,
        host: {
          id: userId,
          socketId: null,
        },
      };

      rooms.set(gameId, newGame);
    } else {
      logger.log(`player ${userId} left`);

      const newGame = {
        ...game,
        players: game.players.map((player) => {
          return player.id === userId
            ? {
                ...player,
                privateData: { ...player.privateData, socketId: null },
              }
            : player;
        }),
      };

      rooms.set(gameId, newGame);
    }
  }
};

const getRooms = (): Map<string, RTCGame> => rooms;

const updateRoom = (gameId: string, newGame: RTCGame): RTCGame => {
  const room = rooms.get(gameId);

  if (!room) {
    throw new Error(`no room set with id ${gameId}`);
  }

  rooms.set(gameId, newGame);

  return newGame;
};

const deleteRoom = (gameId: string): boolean => {
  return rooms.delete(gameId);
};

export default {
  createRoom,
  joinRoom,
  getRoomGame,
  leaveRoom,
  updateRoom,
  getRooms,
  deleteRoom,
};
