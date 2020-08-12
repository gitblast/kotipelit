import * as callbacks from './socketio.callbacks';
import * as socketService from './socketio';
import roomService from './rooms';
import Url from '../models/url';
import * as events from './socketio.events';
import {
  SocketWithToken,
  JitsiReadyData,
  ActiveGame,
  GameStatus,
  GameType,
} from '../types';

jest.mock('./socketio', () => ({
  broadcast: jest.fn(),
  emit: jest.fn(),
  initRoom: jest.fn(),
  setGameStatus: jest.fn(),
}));

jest.mock('./rooms', () => ({
  joinRoom: jest.fn(),
  addSocketToRoom: jest.fn(),
  getRoomGame: jest.fn(),
  updateRoomGame: jest.fn(),
  getJitsiRoomByRoomId: jest.fn(),
  deleteRoom: jest.fn(),
}));

jest.mock('../models/url', () => ({
  deleteOne: jest.fn(),
}));

const mockSocket = { id: 'mockSocketID' } as SocketWithToken;

describe('socket.io callbacks', () => {
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
    it('should call initRoom', async () => {
      await callbacks.createRoom(mockSocket, 'testID');

      expect(socketService.initRoom).toHaveBeenCalledWith(mockSocket, 'testID');
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
        info: callbacks.getInitialInfo(mockGame),
      });

      await callbacks.startGame(mockSocket, 'testID');
    });

    it('should call setGameStatus', () => {
      expect(socketService.setGameStatus).toHaveBeenLastCalledWith(
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
        info: callbacks.getInitialInfo(mockGame),
      });
    });

    it('should broadcast gameStarting with started game object', () => {
      expect(socketService.broadcast).toHaveBeenLastCalledWith(
        mockSocket,
        'testID',
        events.gameStarting({
          ...mockGame,
          status: GameStatus.RUNNING,
          info: callbacks.getInitialInfo(mockGame),
        })
      );
    });

    it('should emit startSuccess with started game object', () => {
      expect(socketService.emit).toHaveBeenLastCalledWith(
        mockSocket,
        events.startSuccess({
          ...mockGame,
          status: GameStatus.RUNNING,
          info: callbacks.getInitialInfo(mockGame),
        })
      );
    });

    it('should emit start failure on error', async () => {
      const mock = socketService.setGameStatus as jest.Mock;

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

    it('should call delete room', () => {
      expect(roomService.deleteRoom).toHaveBeenLastCalledWith('testID');
    });

    it('should emit delete success', () => {
      expect(socketService.emit).toHaveBeenLastCalledWith(
        mockSocket,
        events.deleteSuccess()
      );
    });

    it('should broadcast game ended', () => {
      expect(socketService.broadcast).toHaveBeenLastCalledWith(
        mockSocket,
        'testID',
        events.gameEnded()
      );
    });

    it('should emit delete failure on error', async () => {
      const getRoomGame = roomService.getRoomGame as jest.Mock;

      getRoomGame.mockImplementationOnce(() => {
        throw new Error('test error');
      });

      await callbacks.endGame(mockSocket, 'testID');

      expect(socketService.emit).toHaveBeenLastCalledWith(
        mockSocket,
        events.deleteFailure('test error')
      );
    });
  });
});
