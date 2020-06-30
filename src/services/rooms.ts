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
  socket: SocketIO.Socket,
  game: ActiveGame
): GameRoom => {
  const newRoom: GameRoom = {
    id,
    hostSocket: socket.id,
    game,
  };

  rooms[id] = newRoom;
  addSocketToRoom(id, socket);

  return newRoom;
};

const joinRoom = (
  gameId: string,
  playerId: string,
  socket: SocketIO.Socket
): void => {
  const room = rooms[gameId];

  if (!room) throw new Error(`Game with id '${gameId}' not found`);

  const playerForSocket = room.game.players.find(
    (player) => player.id === playerId
  );

  if (!playerForSocket)
    throw new Error(`Player with id '${playerId}' not found`);

  playerForSocket.socket = socket;
  addSocketToRoom(gameId, socket);
};

export default {
  getRooms,
  joinRoom,
  createRoom,
};
