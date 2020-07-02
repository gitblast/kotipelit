import { GameRoom, ActiveGame } from '../types';

export let rooms: Record<string, GameRoom> = {};

export const setRooms = (newRooms: Record<string, GameRoom>): void => {
  rooms = newRooms;
};

export const addSocketToRoom = (
  gameId: string,
  socket: SocketIO.Socket
): void => {
  socket.join(gameId);
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
  };

  rooms[id] = newRoom;

  return newRoom;
};

const joinRoom = (
  gameId: string,
  playerId: string,
  socket: SocketIO.Socket
): ActiveGame => {
  const room = rooms[gameId];

  if (!room) throw new Error(`Game with id '${gameId}' not found`);

  const playerForSocket = room.game.players.find(
    (player) => player.id === playerId
  );

  if (!playerForSocket)
    throw new Error(`Player with id '${playerId}' not found`);

  playerForSocket.socket = socket;

  return room.game;
};

export default {
  getRooms,
  joinRoom,
  createRoom,
  addSocketToRoom,
};
