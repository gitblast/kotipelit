import * as callbacks from './socketio.callbacks';
import * as socketService from './socketio';
import roomService from './rooms';
import Url from '../models/url';
import * as events from './socketio.events';
import gameService from '../services/games';
import {
  SocketWithToken,
  JitsiReadyData,
  ActiveGame,
  GameStatus,
  GameType,
  ActiveGamePlayer,
  GameRoom,
  EventType,
} from '../types';
import { Server } from 'socket.io';

jest.mock('./socketio', () => ({
  broadcast: jest.fn(),
  emit: jest.fn(),
  initRoom: jest.fn(),
}));

jest.mock('./rooms');

jest.mock('../models/url', () => ({
  deleteOne: jest.fn(),
}));

jest.mock('../services/games');

const mockSocket = {
  id: 'mockSocketID',
  decoded_token: {
    username: 'testUser',
    gameId: 'gameId',
  },
} as SocketWithToken;

interface MockServer {
  calls: Record<string, string>;
  to: (call: string) => void;
  emit: (call: string) => void;
}

const mockServer: MockServer = {
  calls: {} as Record<string, string>,
  to: function (call: string) {
    this.calls['to'] = call;

    return this;
  },
  emit: function (call: string) {
    this.calls['emit'] = call;

    return this;
  },
};

const mockRooms: Record<string, GameRoom> = {
  gameId: {
    game: {
      hostOnline: true,
      players: [
        ({
          id: 'playerId',
          socket: 'playerSocket',
          online: true,
        } as unknown) as ActiveGamePlayer,
      ],
    } as ActiveGame,
    hostSocket: 'hostSocket',
  } as GameRoom,
};

describe('socket.io callbacks', () => {
  describe('handle disconnect', () => {
    let server: MockServer;

    beforeEach(() => {
      server = { ...mockServer };
    });

    const getRooms = roomService.getRooms as jest.Mock;

    it('should set host offline and broadcast host disconnected if socket host socket', () => {
      getRooms.mockReturnValueOnce(mockRooms);

      const hostSocket = { ...mockSocket, id: 'hostSocket' };

      expect(mockRooms['gameId'].game.hostOnline).toBeTruthy();

      callbacks.handleDisconnect((mockServer as unknown) as Server, hostSocket);

      expect(mockRooms['gameId'].game.hostOnline).toBeFalsy();

      expect(server.calls['to']).toBe(hostSocket.decoded_token.gameId);
      expect(server.calls['emit']).toBe(EventType.HOST_DISCONNECTED);
    });

    it('should call leave room and broadcast player disconnected if player socket', () => {
      const leaveRoom = roomService.leaveRoom as jest.Mock;

      getRooms.mockReturnValueOnce(mockRooms);
      leaveRoom.mockReturnValueOnce(mockRooms['gameId'].game.players[0]);

      const playerSocket = { ...mockSocket, id: 'playerSocket' };

      callbacks.handleDisconnect((server as unknown) as Server, playerSocket);

      expect(leaveRoom).toHaveBeenCalledWith('gameId', playerSocket.id);

      expect(server.calls['to']).toBe(playerSocket.decoded_token.gameId);
      expect(server.calls['emit']).toBe(EventType.PLAYER_DISCONNECTED);
    });
  });

  describe('jitsi ready', () => {
    it('should broadcast game ready', () => {
      const mockData: JitsiReadyData = {
        gameId: 'testID',
        jitsiRoom: 'testRoom',
      };

      callbacks.jitsiReady(mockSocket, mockData);

      expect(socketService.broadcast).toHaveBeenCalledWith(
        mockSocket,
        mockData.gameId,
        events.gameReady(mockData.jitsiRoom)
      );
    });
  });

  describe('create room', () => {
    it('should call getRoomData if room already exists', async () => {
      const getData = roomService.getRoomData as jest.Mock;

      getData.mockReturnValueOnce({
        game: null,
        jitsiToken: null,
        jitsiRoom: null,
      });

      await callbacks.createRoom(mockSocket, 'testID');

      expect(roomService.getRoomData).toHaveBeenCalledWith(
        mockSocket.decoded_token.username,
        'testID'
      );
    });

    it('should call initRoom if no room exists', async () => {
      await callbacks.createRoom(mockSocket, 'unique id');

      expect(socketService.initRoom).toHaveBeenCalledWith(
        mockSocket,
        'unique id'
      );
    });

    it('should call addSocketToRoom', async () => {
      await callbacks.createRoom(mockSocket, 'testID');

      expect(roomService.addSocketToRoom).toHaveBeenCalledWith(
        'testID',
        mockSocket
      );
    });

    it('should emit create success with correct data', async () => {
      const initRoom = socketService.initRoom as jest.Mock;

      const mockReturnValue = {
        game: ({ test: true } as unknown) as ActiveGame,
        jitsiToken: 'testToken',
        jitsiRoom: 'testRoom',
      };

      initRoom.mockResolvedValueOnce(mockReturnValue);

      await callbacks.createRoom(mockSocket, 'testID');

      expect(socketService.emit).toHaveBeenCalledWith(
        mockSocket,
        events.createSuccess(
          mockReturnValue.game,
          mockReturnValue.jitsiToken,
          mockReturnValue.jitsiRoom
        )
      );
    });

    it('should emit create failure on error', async () => {
      const initRoom = socketService.initRoom as jest.Mock;

      const error = { message: 'test error' };

      initRoom.mockRejectedValueOnce(error);

      await callbacks.createRoom(mockSocket, 'testID');

      expect(socketService.emit).toHaveBeenLastCalledWith(
        mockSocket,
        events.createFailure(error.message)
      );
    });
  });

  describe('start game', () => {
    const mockGame = {
      type: GameType.SANAKIERTO,
      status: GameStatus.WAITING,
      players: [
        {
          id: 'mock id',
        },
      ],
    } as ActiveGame;

    beforeAll(async () => {
      const getRoomGame = roomService.getRoomGame as jest.Mock;
      getRoomGame.mockReturnValue(mockGame);

      const updateRoomGame = roomService.updateRoomGame as jest.Mock;
      updateRoomGame.mockReturnValue({
        ...mockGame,
        status: GameStatus.RUNNING,
        info: gameService.getInitialInfo(mockGame),
      });

      await callbacks.startGame(mockSocket, 'testID');
    });

    it('should call setGameStatus', () => {
      expect(gameService.setGameStatus).toHaveBeenLastCalledWith(
        'testID',
        GameStatus.RUNNING
      );
    });

    it('should call getRoomGame', () => {
      expect(roomService.getRoomGame).toHaveBeenLastCalledWith('testID');
    });

    it('should call updateRoomGame with status running and initial info', () => {
      expect(roomService.updateRoomGame).toHaveBeenLastCalledWith('testID', {
        ...mockGame,
        status: GameStatus.RUNNING,
        info: gameService.getInitialInfo(mockGame),
      });
    });

    it('should broadcast gameStarting with started game object', () => {
      expect(socketService.broadcast).toHaveBeenLastCalledWith(
        mockSocket,
        'testID',
        events.gameStarting({
          ...mockGame,
          status: GameStatus.RUNNING,
          info: gameService.getInitialInfo(mockGame),
        })
      );
    });

    it('should emit startSuccess with started game object', () => {
      expect(socketService.emit).toHaveBeenLastCalledWith(
        mockSocket,
        events.startSuccess({
          ...mockGame,
          status: GameStatus.RUNNING,
          info: gameService.getInitialInfo(mockGame),
        })
      );
    });

    it('should emit start failure on error', async () => {
      const mock = gameService.setGameStatus as jest.Mock;

      const error = { message: 'test error' };

      mock.mockRejectedValueOnce(error);

      await callbacks.startGame(mockSocket, 'testID');

      expect(socketService.emit).toHaveBeenLastCalledWith(
        mockSocket,
        events.startFailure(error.message)
      );
    });
  });

  describe('update game', () => {
    const mockGame = { id: 'test' } as ActiveGame;

    beforeAll(() => {
      const updateRoomGame = roomService.updateRoomGame as jest.Mock;

      updateRoomGame.mockReturnValue(mockGame);

      callbacks.updateGame(mockSocket, mockGame);
    });

    it('should call update room game', () => {
      expect(roomService.updateRoomGame).toHaveBeenLastCalledWith(
        mockGame.id,
        mockGame
      );
    });

    it('should broadcast game updated', () => {
      expect(socketService.broadcast).toHaveBeenLastCalledWith(
        mockSocket,
        mockGame.id,
        events.gameUpdated(mockGame)
      );
    });

    it('should emit update success', () => {
      expect(socketService.emit).toHaveBeenLastCalledWith(
        mockSocket,
        events.updateSuccess(mockGame)
      );
    });

    it('should emit update failure on error', () => {
      const updateRoomGame = roomService.updateRoomGame as jest.Mock;

      updateRoomGame.mockImplementationOnce(() => {
        throw new Error('test error');
      });

      callbacks.updateGame(mockSocket, mockGame);

      expect(socketService.emit).toHaveBeenLastCalledWith(
        mockSocket,
        events.updateFailure('test error')
      );
    });
  });

  describe('join game', () => {
    const mockGame = ({ test: true } as unknown) as ActiveGame;

    beforeAll(() => {
      const joinRoom = roomService.joinRoom as jest.Mock;
      joinRoom.mockReturnValue(mockGame);

      const getJitsi = roomService.getJitsiRoomByRoomId as jest.Mock;
      getJitsi.mockReturnValue('testJitsi');

      callbacks.joinGame(mockSocket, 'testID', 'testPlayer');
    });

    it('should call addSocketToRoom', () => {
      expect(roomService.addSocketToRoom).toHaveBeenLastCalledWith(
        'testID',
        mockSocket
      );
    });

    it('should call join room', () => {
      expect(roomService.joinRoom).toHaveBeenLastCalledWith(
        'testID',
        'testPlayer',
        'mockSocketID'
      );
    });

    it('should call getJitsiRoomByRoomId', () => {
      expect(roomService.getJitsiRoomByRoomId).toHaveBeenLastCalledWith(
        'testID'
      );
    });

    it('should emit join success', () => {
      expect(socketService.emit).toHaveBeenLastCalledWith(
        mockSocket,
        events.joinSuccess(mockGame, 'testJitsi')
      );
    });

    it('should broadcast player joined', () => {
      expect(socketService.broadcast).toHaveBeenLastCalledWith(
        mockSocket,
        'testID',
        events.playerJoined('testPlayer')
      );
    });

    it('should emit join failure on error', () => {
      const joinRoom = roomService.joinRoom as jest.Mock;
      joinRoom.mockImplementationOnce(() => {
        throw new Error('test error');
      });

      callbacks.joinGame(mockSocket, 'testID', 'testPlayer');

      expect(socketService.emit).toHaveBeenLastCalledWith(
        mockSocket,
        events.joinFailure('test error')
      );
    });
  });

  describe('end game', () => {
    const mockGame = {
      id: 'testID',
      players: [
        {
          id: 'first',
        },
        {
          id: 'second',
        },
      ],
    };

    beforeAll(async () => {
      const getRoomGame = roomService.getRoomGame as jest.Mock;

      getRoomGame.mockReturnValue(mockGame);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      const deleteOne = Url.deleteOne as jest.Mock;

      deleteOne.mockResolvedValue(null);

      await callbacks.endGame(mockSocket, 'testID');
    });

    it('should call getRoomGame', () => {
      expect(roomService.getRoomGame).toHaveBeenLastCalledWith('testID');
    });

    it('should call Url.deleteOne for each player', () => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(Url.deleteOne).toHaveBeenCalledWith({
        playerId: 'first',
        gameId: 'testID',
      });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(Url.deleteOne).toHaveBeenCalledWith({
        playerId: 'second',
        gameId: 'testID',
      });
    });

    it('should update status and players to db', () => {
      expect(gameService.saveFinishedGame).toHaveBeenLastCalledWith(
        'testID',
        mockGame
      );
    });

    it('should call delete room', () => {
      expect(roomService.deleteRoom).toHaveBeenLastCalledWith('testID');
    });

    it('should emit end success', () => {
      expect(socketService.emit).toHaveBeenLastCalledWith(
        mockSocket,
        events.endSuccess(mockGame.id)
      );
    });

    it('should broadcast game ended', () => {
      expect(socketService.broadcast).toHaveBeenLastCalledWith(
        mockSocket,
        'testID',
        events.gameEnded()
      );
    });

    it('should emit end failure on error', async () => {
      const getRoomGame = roomService.getRoomGame as jest.Mock;

      getRoomGame.mockImplementationOnce(() => {
        throw new Error('test error');
      });

      await callbacks.endGame(mockSocket, 'testID');

      expect(socketService.emit).toHaveBeenLastCalledWith(
        mockSocket,
        events.endFailure('test error')
      );
    });
  });
});
