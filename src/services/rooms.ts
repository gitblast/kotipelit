import {
  GameRoom,
  ActiveGame,
  GamePlayerWithStatus,
  ReturnedGame,
  WaitingGame,
} from '../types';

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
  game: WaitingGame
): GameRoom => {
  const newRoom: GameRoom = {
    id,
    hostSocket: hostSocketID,
    game,
    jitsiRoom: null,
  };

  rooms[id] = newRoom;

  return newRoom;
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
  socket: SocketIO.Socket
): ReturnedGame => {
  const room = rooms[roomId];

  if (!room) throw new Error(`Room with id '${roomId}' not found`);

  const playerForSocket = room.game.players.find(
    (player) => player.id === playerId
  );

  if (!playerForSocket)
    throw new Error(`Player with id '${playerId}' not found`);

  if (playerForSocket.socket)
    log(`Player already has socket set: ${playerForSocket.socket.id}`);

  playerForSocket.socket = socket;

  return mapActiveGameToReturnedGame(room.game);
};

const mapActiveGameToReturnedGame = (game: ActiveGame): ReturnedGame => {
  const playersWithoutSockets: GamePlayerWithStatus[] = game.players.map(
    (player) => ({
      ...player,
      socket: undefined,
      online: !!player.socket,
    })
  );

  return { ...game, players: playersWithoutSockets };
};

export default {
  getRooms,
  joinRoom,
  createRoom,
  addSocketToRoom,
  updateRoomGame,
  getRoomGame,
  setJitsiRoom,
  getJitsiRoomByRoomId,
  mapActiveGameToReturnedGame,
};
