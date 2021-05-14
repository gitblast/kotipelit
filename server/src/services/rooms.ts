import { Role, RTCGameRoom, RTCGameState, SocketWithGameToken } from '../types';
import { RoomNotFoundError } from '../utils/errors';
import { getInitialGameState } from '../utils/helpers';
import logger from '../utils/logger';
import { GameModel } from '../types';

const rooms = new Map<string, RTCGameRoom>();

/**
 * Deletes rooms that have not been updated within the given limit
 * @param limit amount of idle time in milliseconds needed for game to be removed. defaults to 6 hours.
 */
const cleanup = (limit = 6 * 60 * 60 * 1000) => {
  logger.log('cleaning up old rooms');

  rooms.forEach((room, id) => {
    if (Date.now() - room.lastUpdated > limit) {
      logger.log(`deleting room '${id}'`);

      rooms.delete(id);
    }
  });
};

const cleanUpInterval = 24 * 60 * 60 * 1000; // run cleanup every 24 hs

setInterval(cleanup, cleanUpInterval);

const setRoom = (id: string, updatedRoom: Omit<RTCGameRoom, 'lastUpdated'>) => {
  const timeStampedRoom: RTCGameRoom = {
    ...updatedRoom,
    lastUpdated: Date.now(),
  };

  rooms.set(id, timeStampedRoom);
};

const joinRoom = (socket: SocketWithGameToken) => {
  const { role, gameId, id, username } = socket.decodedToken;

  const room = rooms.get(gameId);

  if (!room) {
    throw new RoomNotFoundError(gameId);
  }

  logger.log(`joining ${role} (${username}) to room ${gameId}`);

  if (role === Role.SPECTATOR) {
    if (room.spectatorSockets.length >= room.maxSpectators) {
      throw new Error('Spectator limit full');
    }

    room.spectatorSockets.push(socket.id);
  } else {
    const existingSocketId = room.socketMap.get(id);

    if (existingSocketId) {
      socket.to(existingSocketId).emit('duplicate');
    }

    room.socketMap.set(id, socket.id);
  }

  setRoom(gameId, room);
};

const getRoomState = (roomId: string): RTCGameState => {
  const room = rooms.get(roomId);

  if (!room) {
    throw new RoomNotFoundError(roomId);
  }

  return room.state;
};

const setRoomState = (roomId: string, newState: RTCGameState): void => {
  const room = rooms.get(roomId);

  if (!room) {
    throw new RoomNotFoundError(roomId);
  }

  setRoom(roomId, {
    ...room,
    state: newState,
  });
};

const createRoom = (game: GameModel): void => {
  const existing = rooms.get(game.id);

  if (existing) {
    throw new Error(`Room with id '${game.id}' already exists.`);
  }

  logger.log(`creating room for game '${game.id}'`);

  const socketMap = new Map<string, string | null>();

  game.players.forEach((player) => {
    socketMap.set(player.id, null);
  });

  const newRoom: Omit<RTCGameRoom, 'lastUpdated'> = {
    socketMap,
    spectatorSockets: [],
    maxSpectators: game.allowedSpectators,
    state: getInitialGameState(game),
  };

  setRoom(game.id, newRoom);
};

const leaveRoom = (socket: SocketWithGameToken): void => {
  const { role, gameId, id, username } = socket.decodedToken;

  const room = rooms.get(gameId);

  if (room) {
    if (role === Role.SPECTATOR) {
      room.spectatorSockets = room.spectatorSockets.filter(
        (socketId) => socketId !== socket.id
      );
    } else {
      room.socketMap.set(id, null);
    }

    setRoom(gameId, room);

    logger.log(`${role} '${username}' left`);
  }
};

const getRoom = (id: string): RTCGameRoom => {
  const room = rooms.get(id);

  if (!room) {
    throw new RoomNotFoundError(id);
  }

  return room;
};

const getRooms = (): Map<string, RTCGameRoom> => rooms;

const deleteRoom = (gameId: string): boolean => {
  return rooms.delete(gameId);
};

export default {
  createRoom,
  joinRoom,
  leaveRoom,
  getRooms,
  getRoom,
  deleteRoom,
  getRoomState,
  setRoomState,
};
