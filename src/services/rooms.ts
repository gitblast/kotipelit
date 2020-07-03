import {
  GameRoom,
  ActiveGame,
  ActiveGameWithoutSockets,
  GamePlayerWithStatus,
} from '../types';

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

const joinRoom = (
  gameId: string,
  playerId: string,
  socket: SocketIO.Socket
): ActiveGameWithoutSockets => {
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
};
