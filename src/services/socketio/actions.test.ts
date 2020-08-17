import * as actions from './actions';
import * as events from './events';
import store from '../../store';
import {
  ActionType,
  Action,
  ActiveGame,
  LoggedUser,
  BaseUser,
} from '../../types';
import socketService from './service';

const mockSocket = { mock: true };

const setSocketAction: Action = {
  type: ActionType.SET_SOCKET,
  payload: (mockSocket as unknown) as SocketIOClient.Socket,
};

jest.mock('socket.io-client', () => () => mockSocket);

// mock socket io service
jest.mock('./service', () => ({
  emit: jest.fn(),
  attachListeners: jest.fn(),
  authenticateSocket: jest.fn(),
  getTokenForSocket: jest.fn(),
}));

describe('socketio actions', () => {
  beforeEach(() => store.dispatch(setSocketAction));

  describe('jitsi ready', () => {
    it('should call emit with user socket and given parameters', () => {
      const gameId = 'GAME_ID';
      const jitsiRoom = 'JITSI_ROOM';

      actions.emitJitsiReady(gameId, jitsiRoom);

      expect(socketService.emit).toHaveBeenCalledWith(
        mockSocket,
        events.jitsiReady(gameId, jitsiRoom)
      );
    });
  });

  describe('start game', () => {
    it('should call emit with user socket and given parameters', () => {
      const gameId = 'GAME_ID';

      actions.startGame(gameId);

      expect(socketService.emit).toHaveBeenCalledWith(
        mockSocket,
        events.startGame(gameId)
      );
    });
  });

  describe('update game', () => {
    it('should call emit with user socket and given parameters', () => {
      const game = ({ test: true } as unknown) as ActiveGame;

      actions.updateGame(game);

      expect(socketService.emit).toHaveBeenCalledWith(
        mockSocket,
        events.updateGame(game)
      );
    });
  });

  describe('end game', () => {
    it('should call emit with user socket and given game id', () => {
      const gameId = 'TEST_ID';

      actions.endGame(gameId);

      expect(socketService.emit).toHaveBeenCalledWith(
        mockSocket,
        events.endGame(gameId)
      );
    });
  });

  describe('get auth callback', () => {
    it('should return player callback if no game id is given', () => {
      const playerCallback = actions.getAuthCallback(null);

      playerCallback(mockSocket);

      expect(socketService.attachListeners).toHaveBeenCalledWith(
        mockSocket,
        false
      );

      expect(socketService.emit).toHaveBeenCalledWith(
        mockSocket,
        events.joinGame()
      );
    });

    it('should return host callback if game id is given', () => {
      const hostCallback = actions.getAuthCallback('GAME_ID');

      hostCallback(mockSocket);

      expect(socketService.attachListeners).toHaveBeenCalledWith(
        mockSocket,
        true
      );

      expect(socketService.emit).toHaveBeenCalledWith(
        mockSocket,
        events.createRoom('GAME_ID')
      );
    });
  });

  describe('init player socket', () => {
    beforeEach(() => {
      const tokenGetter = socketService.getTokenForSocket as jest.Mock;

      tokenGetter.mockResolvedValueOnce({
        token: 'TOKEN',
        displayName: 'display',
      });
    });

    it('should throw error if player id is not provided', async () => {
      try {
        await actions.initPlayerSocket('hostName', '');
        throw new Error('expected to throw, but passed');
      } catch (error) {
        expect(error.message).toBe('Pelaajan id puuttuu');
      }
    });

    it('should call getTokenForSocket', async () => {
      await actions.initPlayerSocket('hostName', 'playerId');

      expect(socketService.getTokenForSocket).toHaveBeenCalledWith(
        'hostName',
        'playerId'
      );
    });

    it('should dispatch set display name', async () => {
      store.dispatch({ type: ActionType.LOGOUT });
      const user = store.getState().user as BaseUser;

      expect(user.displayName).toBe(null);

      await actions.initPlayerSocket('hostName', 'playerId');

      const userNow = store.getState().user as BaseUser;

      expect(userNow.displayName).toBe('display');
    });

    it('should call authenticateSocket with token it fetches', async () => {
      await actions.initPlayerSocket('hostName', 'playerId');

      expect(socketService.authenticateSocket).toHaveBeenCalledWith(
        mockSocket,
        'TOKEN',
        expect.any(Function)
      );
    });
  });

  describe('init host socket', () => {
    it('should throw error if game id is not provided', () => {
      try {
        actions.initHostSocket({} as LoggedUser, (null as unknown) as string);
        throw new Error('expected to throw, but passed');
      } catch (error) {
        expect(error.message).toBe('Pelin id puuttuu');
      }
    });

    it('should call authenticateSocket with provided users token', () => {
      actions.initHostSocket({ token: 'TOKEN' } as LoggedUser, 'gameId');

      expect(socketService.authenticateSocket).toHaveBeenCalledWith(
        mockSocket,
        'TOKEN',
        expect.any(Function)
      );
    });
  });
});
