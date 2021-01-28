import {
  RTCGameRoom,
  RTCGame,
  SocketWithToken,
  Role,
  GameType,
} from '../../types';
import logger from '../../utils/logger';

const rooms = new Map<string, RTCGameRoom>();

const joinHostToRoom = (
  room: RTCGameRoom,
  socket: SocketWithToken,
  peerId: string
): RTCGameRoom => {
  const newRoom = {
    ...room,
    host: {
      id: socket.decoded_token.id,
      socketId: socket.id,
      peerId,
      displayName: socket.decoded_token.username,
      isHost: true,
    },
  };

  logger.log(
    `joining host '${socket.decoded_token.username}' to room ${room.game.id}`
  );

  rooms.set(socket.decoded_token.gameId, newRoom);

  return newRoom;
};

const joinPlayerToRoom = (
  room: RTCGameRoom,
  socket: SocketWithToken,
  peerId: string
): RTCGameRoom => {
  const newRoom = {
    ...room,
    players: room.players.map((player) => {
      return player.id === socket.decoded_token.id
        ? {
            ...player,
            socketId: socket.id,
            peerId,
          }
        : player;
    }),
  };

  logger.log(
    `joining player '${socket.decoded_token.username}' to room ${room.game.id}`
  );

  rooms.set(socket.decoded_token.gameId, newRoom);

  // dont return other players' words
  return {
    ...newRoom,
    game: filterGameForUser(newRoom.game, socket.decoded_token.id),
  };
};

const filterGameForUser = (game: RTCGame, userId: string): RTCGame => {
  if (userId === game.host) {
    // return all data to host

    return game;
  }

  if (game.type === GameType.KOTITONNI) {
    // hide words and answers not self
    return {
      ...game,
      players: game.players.map((player) => {
        return player.id === userId
          ? player
          : {
              ...player,
              reservedFor: null,
              inviteCode: '',
              data: {
                answers: {},
                words: [],
              },
            };
      }),
    };
  }

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  throw new Error(`invalid game type: ${game.type}`);
};

const joinRoom = (socket: SocketWithToken, peerId: string): RTCGameRoom => {
  const { role, gameId } = socket.decoded_token;

  const room = rooms.get(gameId);

  if (!room) {
    throw new Error(`No room found with id ${gameId}`);
  }

  switch (role) {
    case Role.HOST: {
      return joinHostToRoom(room, socket, peerId);
    }
    case Role.PLAYER: {
      return joinPlayerToRoom(room, socket, peerId);
    }
    default: {
      throw new Error('No role set for token!');
    }
  }
};

const getRoom = (id: string): RTCGameRoom | null => {
  const room = rooms.get(id);

  return room ? room : null;
};

const createRoom = (game: RTCGame): void => {
  const existing = rooms.get(game.id);

  if (existing) {
    throw new Error(`Room with id ${game.id} already exists.`);
  }

  const newRoom: RTCGameRoom = {
    game,
    host: {
      id: game.host,
      socketId: null,
      peerId: null,
      displayName: 'HOST',
      isHost: true,
    },
    players: game.players.map((player) => {
      return {
        id: player.id,
        displayName: player.name,
        socketId: null,
        peerId: null,
        isHost: false,
      };
    }),
  };

  logger.log(`creating room for game ${game.id}`);

  rooms.set(game.id, newRoom);
};

const leaveRoom = (gameId: string, userId: string): void => {
  const room = rooms.get(gameId);

  if (room) {
    if (userId === room.host.id) {
      logger.log(`host left`);
      rooms.set(gameId, {
        ...room,
        host: { ...room.host, socketId: null, peerId: null },
      });
    } else {
      logger.log(`player ${userId} left`);
      rooms.set(gameId, {
        ...room,
        players: room.players.map((player) =>
          player.id === userId
            ? { ...player, socketId: null, peerId: null }
            : player
        ),
      });
    }
  }
};

const getRooms = (): Map<string, RTCGameRoom> => rooms;

const updateRoomGame = (gameId: string, newGame: RTCGame): RTCGame => {
  const room = rooms.get(gameId);

  if (!room) {
    throw new Error(`no room set with id ${gameId}`);
  }

  rooms.set(gameId, { ...room, game: newGame });

  return newGame;
};

const deleteRoom = (gameId: string): boolean => {
  return rooms.delete(gameId);
};

export default {
  createRoom,
  joinRoom,
  getRoom,
  leaveRoom,
  updateRoomGame,
  filterGameForUser,
  getRooms,
  deleteRoom,
};
