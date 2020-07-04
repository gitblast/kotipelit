import {
  GameRoom,
  ActiveGame,
  GamePlayerWithStatus,
  ReturnedGame,
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
  game: ActiveGame
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

const updateRoomGame = (roomId: string, newGame: ActiveGame): void => {
  const room = rooms[roomId];

  if (!room) throw new Error(`Room with id '${roomId}' not found`);

  room.game = newGame;
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
  gameId: string,
  playerId: string,
  socket: SocketIO.Socket
): ReturnedGame => {
  const room = rooms[gameId];

  if (!room) throw new Error(`Game with id '${gameId}' not found`);

  const playerForSocket = room.game.players.find(
    (player) => player.id === playerId
  );

  if (!playerForSocket)
    throw new Error(`Player with id '${playerId}' not found`);

  playerForSocket.socket = socket;

  const playersWithoutSockets: GamePlayerWithStatus[] = room.game.players.map(
    (player) => ({
      id: player.id,
      name: player.name,
      online: !!player.socket,
    })
  );

  return { ...room.game, players: playersWithoutSockets };
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
};
