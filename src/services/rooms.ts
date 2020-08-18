import {
  GameRoom,
  ActiveGame,
  WaitingGame,
  CreateRoomResponse,
  ActiveGamePlayer,
} from '../types';
import { getJitsiToken } from './socketio';

import { log } from '../utils/logger';

export let rooms: Record<string, GameRoom> = {};

export const setRooms = (newRooms: Record<string, GameRoom>): void => {
  rooms = newRooms;
};

export const addSocketToRoom = (
  roomId: string,
  socket: SocketIO.Socket
): void => {
  log(`adding ${socket.id} to socket.io room ${roomId}`);
  socket.join(roomId);
};

const getRooms = (): Record<string, GameRoom> => rooms;

const createRoom = (
  id: string,
  hostSocketID: string,
  game: WaitingGame,
  jitsiRoom: string
): GameRoom => {
  const newRoom: GameRoom = {
    id,
    hostSocket: hostSocketID,
    game,
    jitsiRoom,
  };

  rooms[id] = newRoom;

  return newRoom;
};

const getRoomData = (
  username: string,
  roomId: string
): CreateRoomResponse | null => {
  const room = rooms[roomId];

  if (!room) return null;

  return {
    jitsiRoom: room.jitsiRoom,
    game: room.game,
    jitsiToken: getJitsiToken(username, room.jitsiRoom),
  };
};

const setHostOnline = (roomId: string, newStatus: boolean): void => {
  const room = rooms[roomId];

  if (!room) throw new Error(`Room with id '${roomId}' not found`);

  room.game.hostOnline = newStatus;
};

const getRoomGame = (roomId: string): ActiveGame => {
  const room = rooms[roomId];

  if (!room) throw new Error(`Room with id '${roomId}' not found`);

  return room.game;
};

const updateRoomGame = (roomId: string, newGame: ActiveGame): ActiveGame => {
  const room = rooms[roomId];

  if (!room) throw new Error(`Room with id '${roomId}' not found`);

  room.game = newGame;

  return room.game;
};

const getJitsiRoomByRoomId = (roomId: string): string => {
  const room = rooms[roomId];

  if (!room) throw new Error(`Room with id '${roomId}' not found`);
  if (!room.jitsiRoom) throw new Error(`Room '${roomId}' has no jitsiRoom set`);

  return room.jitsiRoom;
};

const setJitsiRoom = (roomId: string, jitsiRoom: string): void => {
  const room = rooms[roomId];

  if (!room) throw new Error(`Room with id '${roomId}' not found`);

  room.jitsiRoom = jitsiRoom;
};

const joinRoom = (
  roomId: string,
  playerId: string,
  socketId: string
): ActiveGame => {
  const room = rooms[roomId];

  if (!room) throw new Error(`Room with id '${roomId}' not found`);

  const playerForSocket = room.game.players.find(
    (player) => player.id === playerId
  );

  if (!playerForSocket)
    throw new Error(`Player with id '${playerId}' not found`);

  if (playerForSocket.socket)
    log(`Player already has socket set: ${playerForSocket.socket}. Replacing`);

  playerForSocket.socket = socketId;
  playerForSocket.online = true;

  return room.game;
};

const leaveRoom = (roomId: string, socketId: string): ActiveGamePlayer => {
  const room = rooms[roomId];

  if (!room) throw new Error(`Room with id '${roomId}' not found`);

  const playerMatchingSocket = room.game.players.find(
    (player) => player.socket === socketId
  );

  if (!playerMatchingSocket)
    throw new Error(`Player with socket id '${socketId}' not found`);

  playerMatchingSocket.socket = null;
  playerMatchingSocket.online = false;

  return playerMatchingSocket;
};

const deleteRoom = (roomId: string): void => {
  const room = rooms[roomId];

  if (!room) throw new Error(`Room with id '${roomId}' not found`);

  delete rooms[roomId];
};

export default {
  getRooms,
  joinRoom,
  createRoom,
  deleteRoom,
  addSocketToRoom,
  updateRoomGame,
  getRoomGame,
  setJitsiRoom,
  getJitsiRoomByRoomId,
  getRoomData,
  leaveRoom,
  setHostOnline,
};
