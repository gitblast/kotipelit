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

  room.socketMap.set(id, socket.id);

  setRoom(gameId, room);

  if (role === Role.HOST) {
    return room.game;
  } else if (role === Role.PLAYER) {
    return gameService.filterGameForUser(room.game, id);
  } else {
    return gameService.filterGameForSpectator(room.game);
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
    room.socketMap.set(userId, null);

    setRoom(gameId, room);

    if (userId === room.game.host.id) {
      logger.log(`host left`);
    } else {
      logger.log(`player ${userId} left`);
    }
  }
};

const getRoom = (id: string): RTCGameRoom | null => {
  return rooms.get(id) ?? null;
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
  getRoom,
  deleteRoom,
};
