import roomService, { rooms, setRooms, addSocketToRoom } from './rooms';
import { GameRoom, ActiveGame, ActiveGamePlayer } from '../types';

const socketMock = {
  id: 'testIDfromSocket',
  clicks: 0,
  lastCalledWith: '',
  join: function (call: string) {
    this.lastCalledWith = call;
    this.clicks += 1;
  },
};

describe('rooms service', () => {
  it('should have empty object as rooms in the beginning', () => {
    expect(rooms).toEqual({});
  });

  it('should return rooms with getRooms', () => {
    expect(roomService.getRooms()).toBe(rooms);
  });

  it('should set rooms with setRooms', () => {
    const newRooms: Record<string, GameRoom> = {
      id1: {} as GameRoom,
      id2: {} as GameRoom,
    };

    setRooms(newRooms);

    expect(roomService.getRooms()).toBe(newRooms);
  });

  it('should create new room with createRoom', () => {
    setRooms({});

    expect(roomService.getRooms()).toEqual({});

    roomService.createRoom('test_room_id', 'hostSocketId', {} as ActiveGame);

    expect(roomService.getRooms()).toEqual({
      test_room_id: {
        id: 'test_room_id',
        hostSocket: 'hostSocketId',
        game: {},
      },
    });
  });

  it('should add socket to room with addSocketToRoom', () => {
    const mock = { ...socketMock };

    addSocketToRoom('gameId', (mock as unknown) as SocketIO.Socket);

    expect(mock.clicks).toBe(1);
    expect(mock.lastCalledWith).toBe('gameId');
  });

  describe('getRoomGame', () => {
    it('should return rooms game if room found', () => {
      setRooms({});
      const game = {
        testRoom: true,
      };

      const room = roomService.createRoom(
        'test_room_id',
        'hostSocketId',
        (game as unknown) as ActiveGame
      );

      expect(roomService.getRoomGame('test_room_id')).toBe(room.game);
    });

    it('should throw error if room not found', () => {
      setRooms({});
      expect(() => roomService.getRoomGame('invalid_id')).toThrowError(
        `Room with id 'invalid_id' not found`
      );
    });
  });

  describe('updateRoomGame', () => {
    it('should replace current game if room found', () => {
      setRooms({});
      const initialGame = {
        testRoom: true,
      };

      const room = roomService.createRoom(
        'test_room_id',
        'hostSocketId',
        (initialGame as unknown) as ActiveGame
      );

      expect(room.game).toEqual(initialGame);

      const newGame = { newGame: true };

      roomService.updateRoomGame(
        'test_room_id',
        (newGame as unknown) as ActiveGame
      );

      expect(room.game).toEqual(newGame);
    });

    it('should throw error if room not found', () => {
      setRooms({});
      expect(() =>
        roomService.updateRoomGame('invalid_id', {} as ActiveGame)
      ).toThrowError(`Room with id 'invalid_id' not found`);
    });
  });

  describe('joinRoom', () => {
    it('should throw error if game with id not found', () => {
      setRooms({});

      expect(() =>
        roomService.joinRoom('gameId', 'playerId', {} as SocketIO.Socket)
      ).toThrowError(`Game with id 'gameId' not found`);
    });

    it('should throw error if player with id not found', () => {
      const mock: Record<string, GameRoom> = {
        gameId: {
          game: {
            players: [{ id: 'notMatching' } as ActiveGamePlayer],
          } as ActiveGame,
        } as GameRoom,
      };

      setRooms(mock);

      const socket = { ...socketMock };

      expect(() =>
        roomService.joinRoom(
          'gameId',
          'playerId',
          (socket as unknown) as SocketIO.Socket
        )
      ).toThrowError(`Player with id 'playerId' not found`);
    });

    it('should add socket to player and return room game if no errors', () => {
      const mock: Record<string, GameRoom> = {
        gameId: {
          game: {
            id: 'TEST_GAME',
            players: [
              {
                id: 'playerId',
                socket: null,
                name: 'name',
              } as ActiveGamePlayer,
            ],
          } as ActiveGame,
        } as GameRoom,
      };

      setRooms(mock);

      const room = roomService.getRooms()['gameId'];
      expect(room).toBeDefined();

      let player = room.game.players.find((p) => p.id === 'playerId');

      expect(player).toBeDefined();
      player = player as ActiveGamePlayer;
      expect(player.socket).toBeNull();

      const socket = { ...socketMock };

      const game = roomService.joinRoom(
        'gameId',
        'playerId',
        (socket as unknown) as SocketIO.Socket
      );

      const gameWithoutSockets = {
        ...mock.gameId.game,
        players: mock.gameId.game.players.map((p) => ({
          id: p.id,
          name: p.name,
          online: !!p.socket,
        })),
      };

      expect(player.socket).not.toBeNull();
      expect(player.socket).toEqual(socket);
      expect(game).toEqual(gameWithoutSockets);
    });
  });
});
