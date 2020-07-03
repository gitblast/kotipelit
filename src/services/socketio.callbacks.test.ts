import * as callbacks from './socketio.callbacks';
import { CommonEvent, PlayerEvent, MockSocket } from '../types';

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
      callbacks.connect(socket, 'TOKEN', false)();
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

    it('should listen to "authenticated" and emit "join game" when received', () => {
      expect(socketAsMock.listeners[CommonEvent.AUTHENTICATED]).toEqual(
        expect.any(Function)
      );

      expect(Object.keys(socketAsMock.emitted)).not.toContain(
        PlayerEvent.JOIN_GAME
      );

      socketAsMock.listeners[CommonEvent.AUTHENTICATED]();

      expect(Object.keys(socketAsMock.emitted)).toContain(
        PlayerEvent.JOIN_GAME
      );
    });
  });
});
