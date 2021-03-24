import {
  RTCGame,
  SocketWithToken,
  Role,
  FilteredRTCGame,
  RTCGameRoom,
  RTCGameState,
} from '../../types';
import { RoomNotFoundError } from '../../utils/errors';
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
    throw new RoomNotFoundError(gameId);
  }

  logger.log(`joining ${role} (${username}) to room ${gameId}`);

  if (role === Role.SPECTATOR) {
    room.spectatorSockets.push(socket.id);
  } else {
    room.socketMap.set(id, socket.id);
  }

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

  const newRoom: Omit<RTCGameRoom, 'lastUpdated'> = {
    game,
    socketMap,
    spectatorSockets: [],
    state: gameService.getInitialGameState(game),
  };

  setRoom(game.id, newRoom);
};

const leaveRoom = (socket: SocketWithToken): void => {
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

    if (id === room.game.host.id) {
      logger.log(`host left`);
    } else {
      logger.log(`player '${username}' left`);
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
    throw new RoomNotFoundError(gameId);
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
  getRoomState,
  setRoomState,
};
