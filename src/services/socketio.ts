/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import Game from '../models/game';

import { Server, Socket } from 'socket.io';
import {
  GameRoom,
  CreateRoomData,
  GameStatus,
  ActiveGame,
  EmittedEvent,
  EventType,
} from '../types';

let rooms: GameRoom[] = [];

export const setRooms = (newRooms: GameRoom[]): void => {
  rooms = newRooms;
};

export const getRooms = (): GameRoom[] => rooms;

export const initGameForRoom = async (
  socket: Socket,
  gameId: string,
  hostName: string
): Promise<string> => {
  console.log('joining room', hostName);
  socket.join(gameId);

  console.log('creating', gameId, 'host:', hostName);

  const game = await Game.findById(gameId);

  if (!game) throw new Error(`No game found with id ${gameId}`);

  game.status = GameStatus.WAITING;

  await game.save();

  const roomGame: ActiveGame = {
    id: game._id.toString(),
    status: GameStatus.WAITING,
    type: game.type,
    startTime: game.startTime,
    players: game.players.map((player) => ({
      ...player,
      socket: null,
    })),
  };

  const newRoom: GameRoom = {
    id: gameId,
    hostSocket: socket.id,
    game: roomGame,
  };

  rooms.push(newRoom);

  console.log('rooms after:', rooms);
  console.log('TODO! create jitsi token here or in routes');

  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250ZXh0Ijp7InVzZXIiOnsibmFtZSI6InVzZXJuYW1lIn19LCJhdWQiOiJrb3RpcGVsaXQuY29tIiwiaXNzIjoia290aXBlbGl0LmNvbSIsInN1YiI6Im1lZXQua290aXBlbGl0LmNvbSIsInJvb20iOiJ1c2VybmFtZSIsImlhdCI6MTUxNjIzOTAyMn0.t1eAkoPrgPTPyTDeUVGfVwJ3xWV_tCEwOxWihexY5hE';
};

export const createSuccess = (jitsiToken: string): EmittedEvent => ({
  event: EventType.CREATE_SUCCESS,
  data: jitsiToken,
});

export const createFailure = (): EmittedEvent => ({
  event: EventType.CREATE_FAILURE,
  data: { error: 'error message' },
});

const emit = (socket: Socket, eventObj: EmittedEvent): void => {
  const { event, data } = eventObj;
  socket.emit(event, data);
};

const handler = (io: Server): void => {
  io.on('connection', (socket: Socket) => {
    console.log('connection from', socket.id);
    console.log('TODO: proof recieved data');

    socket.on(EventType.CREATE_ROOM, (data: CreateRoomData) => {
      console.log('TODO: authenticate socket io');
      initGameForRoom(socket, data.gameId, data.hostName)
        .then((token: string) => emit(socket, createSuccess(token)))
        .catch(() => emit(socket, createFailure()));
    });
  });
};

export default handler;
