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

    const socket = { ...socketMock };

    roomService.createRoom(
      'test_room_id',
      (socket as unknown) as SocketIO.Socket,
      {} as ActiveGame
    );

    expect(roomService.getRooms()).toEqual({
      test_room_id: {
        id: 'test_room_id',
        hostSocket: 'testIDfromSocket',
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

  describe('joinRoom', () => {
    it('should throw error if game with id not found', () => {
      setRooms({});

      expect(() =>
        roomService.joinRoom('gameId', 'playerId', {} as SocketIO.Socket)
      ).toThrowError(`Game with id 'gameId' not found`);
    });

    it('should throw error if game with id not found', () => {
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

    it('should add socket to player if game and player are found', () => {
      const mock: Record<string, GameRoom> = {
        gameId: {
          game: {
            players: [{ id: 'playerId', socket: null } as ActiveGamePlayer],
          } as ActiveGame,
        } as GameRoom,
      };

      setRooms(mock);

      const room = roomService.getRooms()['gameId'];
      expect(room).toBeDefined();

      let playerFirst = room.game.players.find((p) => p.id === 'playerId');

      expect(playerFirst).toBeDefined();
      playerFirst = playerFirst as ActiveGamePlayer;
      expect(playerFirst.socket).toBeNull();

      const socket = { ...socketMock };

      roomService.joinRoom(
        'gameId',
        'playerId',
        (socket as unknown) as SocketIO.Socket
      );

      let playerNow = room.game.players.find((p) => p.id === 'playerId');

      expect(playerNow).toBeDefined();

      playerNow = playerNow as ActiveGamePlayer;
      expect(playerNow.socket).not.toBeNull();
      expect(playerNow.socket).toEqual({ ...socket, clicks: 1 });
    });
  });
});
