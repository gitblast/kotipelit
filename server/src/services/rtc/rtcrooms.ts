import {
  RTCGame,
  SocketWithToken,
  Role,
  FilteredRTCGame,
  RTCGameRoom,
} from '../../types';
import logger from '../../utils/logger';
import gameService from '../games';

const rooms = new Map<string, RTCGameRoom>();

const setRoom = (id: string, updatedRoom: Omit<RTCGameRoom, 'lastUpdated'>) => {
  const timeStampedRoom: RTCGameRoom = {
    ...updatedRoom,
    lastUpdated: Date.now(),
  };

  rooms.set(id, timeStampedRoom);
};

const joinRoom = (socket: SocketWithToken): RTCGame | FilteredRTCGame => {
  const { role, gameId, id, username } = socket.decodedToken;

  const room = rooms.get(gameId);

  if (!room) {
    throw new Error(`No room found with id ${gameId}`);
  }

  logger.log(`joining ${role} (${username}) to room ${gameId}`);

  switch (role) {
    case Role.HOST: {
      const newRoom = {
        ...room,
        game: {
          ...room.game,
          host: {
            ...room.game.host,
            privateData: {
              ...room.game.host.privateData,
              socketId: socket.id,
            },
          },
        },
      };

      setRoom(gameId, newRoom);

      return newRoom.game;
    }
    case Role.PLAYER: {
      const newRoom = {
        ...room,
        game: {
          ...room.game,
          players: room.game.players.map((player) => {
            return player.id === id
              ? {
                  ...player,
                  privateData: { ...player.privateData, socketId: socket.id },
                }
              : player;
          }),
        },
      };

      setRoom(gameId, newRoom);

      return gameService.filterGameForUser(newRoom.game, id);
    }
    default: {
      throw new Error('No role set for token!');
    }
  }
};

const getRoomGame = (id: string): RTCGame | null => {
  const room = rooms.get(id);

  return room?.game ?? null;
};

const createRoom = (game: RTCGame): void => {
  const existing = rooms.get(game.id);

  if (existing) {
    throw new Error(`Room with id '${game.id}' already exists.`);
  }

  logger.log(`creating room for game '${game.id}'`);

  const socketMap = new Map<string, string | null>();

  game.players.forEach((player) => {
    socketMap.set(player.id, null);
  });

  const newRoom = {
    game,
    socketMap,
  };

  setRoom(game.id, newRoom);
};

const leaveRoom = (gameId: string, userId: string): void => {
  const room = rooms.get(gameId);

  if (room) {
    if (userId === room.game.host.id) {
      logger.log(`host left`);

      const newRoom = {
        ...room,
        game: {
          ...room.game,
          host: {
            ...room.game.host,
            privateData: {
              ...room.game.host.privateData,
              socketId: null,
            },
          },
        },
      };

      setRoom(gameId, newRoom);
    } else {
      logger.log(`player ${userId} left`);

      const newRoom = {
        ...room,
        game: {
          ...room.game,
          players: room.game.players.map((player) => {
            return player.id === userId
              ? {
                  ...player,
                  privateData: { ...player.privateData, socketId: null },
                }
              : player;
          }),
        },
      };

      setRoom(gameId, newRoom);
    }
  }
};

const getRooms = (): Map<string, RTCGameRoom> => rooms;

const updateRoomGame = (gameId: string, newGame: RTCGame): RTCGame => {
  const room = rooms.get(gameId);

  if (!room) {
    throw new Error(`no room set with id ${gameId}`);
  }

  const updatedRoom = {
    ...room,
    game: newGame,
  };

  setRoom(gameId, updatedRoom);

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
  updateRoomGame,
  getRooms,
  deleteRoom,
};
