import * as callbacks from './callbacks';
import store from '../../store';
import socketService from './service';
import * as events from './events';
import { hardcodedActiveSanakierto } from '../../constants';
import {
  CommonEvent,
  MockSocket,
  ActionType,
  Action,
  ActiveGame,
  CreateSuccessResponse,
  LoggedUser,
  JoinSuccessResponse,
} from '../../types';

jest.mock('./service', () => ({
  emit: jest.fn(),
}));

const mockSocket: MockSocket = {
  listeners: {},
  emitted: {},
  on: function (event: string, callback: Function) {
    this.listeners[event] = callback;
    return this;
  },
  emit: function (event: string, data: object) {
    this.emitted[event] = data;
    return this;
  },
};

let socket: SocketIOClient.Socket;
let socketAsMock: MockSocket;

describe('callbacks', () => {
  beforeEach(() => {
    socket = ({ ...mockSocket } as unknown) as SocketIOClient.Socket;
    socketAsMock = (socket as unknown) as MockSocket;
  });

  describe('connect', () => {
    beforeEach(() => {
      const callback = (socket: SocketIOClient.Socket) =>
        socket.emit('callback fired', 'yes');

      callbacks.connect(socket, 'TOKEN', callback)();
    });

    it('should emit "authorize" with token', () => {
      expect(socketAsMock.emitted[CommonEvent.AUTH_REQUEST]).toEqual({
        token: 'TOKEN',
      });
    });

    it('should listen to "unauthorized" and throw error if recieved', () => {
      expect(socketAsMock.listeners[CommonEvent.UNAUTHORIZED]).toEqual(
        expect.any(Function)
      );

      expect(() =>
        socketAsMock.listeners[CommonEvent.UNAUTHORIZED]('error')
      ).toThrowError();
    });

    it('should listen to "authenticated" and call callback when recieved', () => {
      expect(socketAsMock.listeners[CommonEvent.AUTHENTICATED]).toEqual(
        expect.any(Function)
      );

      expect(socketAsMock.emitted['callback fired']).not.toBeDefined();

      socketAsMock.listeners[CommonEvent.AUTHENTICATED]();

      expect(socketAsMock.emitted['callback fired']).toBeDefined();
    });
  });

  describe('player joined', () => {
    const setActiveGameAction: Action = {
      type: ActionType.SET_ACTIVE_GAME,
      payload: hardcodedActiveSanakierto,
    };

    let game: ActiveGame;

    beforeEach(() => {
      store.dispatch(setActiveGameAction);

      const setGame = store.getState().games.activeGame;

      if (!setGame)
        throw new Error(
          'Something went wrong with setting active game for tests'
        );

      game = setGame;
    });

    it('should throw error if no active game is set', () => {
      store.dispatch({
        type: ActionType.SET_ACTIVE_GAME,
        payload: (null as unknown) as ActiveGame,
      });

      expect(() => callbacks.playerJoined('PLAYER_ID')).toThrowError();
    });

    it('should mark player with given id as online', () => {
      let player = game.players.find((p) => p.id === '1');

      if (!player)
        throw new Error('No player found with id "1", check constants');

      expect(player.online).toBe(false);

      callbacks.playerJoined('1');

      const gameNow = store.getState().games.activeGame;

      if (!gameNow)
        throw new Error('Expected active game to be set, got null / undefined');

      player = gameNow.players.find((p) => p.id === '1');

      if (!player)
        throw new Error('No player found with id "1", check constants');

      expect(player.online).toBe(true);
    });
  });

  describe('create success', () => {
    const responseData: CreateSuccessResponse = {
      jitsiRoom: 'ROOM',
      jitsiToken: 'TOKEN',
      game: ({ test: true } as unknown) as ActiveGame,
    };

    beforeEach(() => {
      store.dispatch({
        type: ActionType.LOGIN_SUCCESS,
        payload: {
          username: 'username',
          token: 'TOKEN',
        },
      });
    });

    it('should set jitsi room', () => {
      const jitsiRoom = store.getState().user.jitsiRoom;

      expect(jitsiRoom).toBe(null);

      callbacks.createSuccess(responseData);

      const roomNow = store.getState().user.jitsiRoom;

      expect(roomNow).toBe(responseData.jitsiRoom);
    });

    it('should set jitsi token', () => {
      const user = store.getState().user as LoggedUser;

      expect(user.jitsiToken).toBe(null);

      callbacks.createSuccess(responseData);

      const userNow = store.getState().user as LoggedUser;

      expect(userNow.jitsiToken).toBe(responseData.jitsiToken);
    });

    it('should set active game', () => {
      store.dispatch({
        type: ActionType.SET_ACTIVE_GAME,
        payload: (null as unknown) as ActiveGame,
      });

      const game = store.getState().games.activeGame;

      expect(game).toBe(null);

      callbacks.createSuccess(responseData);

      const gameNow = store.getState().games.activeGame;

      expect(gameNow).toEqual(responseData.game);
    });
  });

  describe('update success', () => {
    it('should set active game to given game', () => {
      store.dispatch({
        type: ActionType.SET_ACTIVE_GAME,
        payload: (null as unknown) as ActiveGame,
      });

      const dummy = ({ test: true } as unknown) as ActiveGame;

      const game = store.getState().games.activeGame;

      expect(game).toBe(null);

      callbacks.updateSuccess(dummy);

      const gameNow = store.getState().games.activeGame;

      expect(gameNow).toEqual(dummy);
    });
  });

  describe('start success', () => {
    it('should set active game to given game', () => {
      store.dispatch({
        type: ActionType.SET_ACTIVE_GAME,
        payload: (null as unknown) as ActiveGame,
      });

      const dummy = ({ test: true } as unknown) as ActiveGame;

      const game = store.getState().games.activeGame;

      expect(game).toBe(null);

      callbacks.startSuccess(dummy);

      const gameNow = store.getState().games.activeGame;

      expect(gameNow).toEqual(dummy);
    });
  });

  describe('join success', () => {
    const joinResponse: JoinSuccessResponse = {
      jitsiRoom: 'jitsiRoom',
      game: ({ test: true } as unknown) as ActiveGame,
    };

    beforeEach(() => {
      store.dispatch({
        type: ActionType.LOGOUT,
      });
    });

    it('should set jitsi room', () => {
      const jitsiRoom = store.getState().user.jitsiRoom;

      expect(jitsiRoom).toBe(null);

      callbacks.joinSuccess(joinResponse);

      const roomNow = store.getState().user.jitsiRoom;

      expect(roomNow).toBe(joinResponse.jitsiRoom);
    });

    it('should set active game to given game', () => {
      store.dispatch({
        type: ActionType.SET_ACTIVE_GAME,
        payload: (null as unknown) as ActiveGame,
      });

      const dummy = ({ test: true } as unknown) as ActiveGame;

      const game = store.getState().games.activeGame;

      expect(game).toBe(null);

      callbacks.joinSuccess(joinResponse);

      const gameNow = store.getState().games.activeGame;

      expect(gameNow).toEqual(dummy);
    });
  });

  describe('game ready', () => {
    beforeEach(() => {
      store.dispatch({
        type: ActionType.LOGOUT,
      });

      store.dispatch({
        type: ActionType.SET_SOCKET,
        payload: socket,
      });
    });

    it('should handle error if socket not set', () => {
      /** @TODO */

      store.dispatch({
        type: ActionType.LOGOUT,
      });

      callbacks.gameReady();

      expect(socketService.emit).not.toHaveBeenCalled();
    });

    it('should emit join game', () => {
      callbacks.gameReady();

      expect(socketService.emit).toHaveBeenCalledWith(
        socket,
        events.joinGame()
      );
    });
  });

  describe('game starting', () => {
    it('should set active game', () => {
      store.dispatch({
        type: ActionType.SET_ACTIVE_GAME,
        payload: (null as unknown) as ActiveGame,
      });

      const dummy = ({ test: true } as unknown) as ActiveGame;

      const game = store.getState().games.activeGame;

      expect(game).toBe(null);

      callbacks.gameStarting(dummy);

      const gameNow = store.getState().games.activeGame;

      expect(gameNow).toEqual(dummy);
    });
  });

  describe('game updated', () => {
    it('should set active game', () => {
      store.dispatch({
        type: ActionType.SET_ACTIVE_GAME,
        payload: (null as unknown) as ActiveGame,
      });

      const dummy = ({ test: true } as unknown) as ActiveGame;

      const game = store.getState().games.activeGame;

      expect(game).toBe(null);

      callbacks.gameUpdated(dummy);

      const gameNow = store.getState().games.activeGame;

      expect(gameNow).toEqual(dummy);
    });
  });
});
