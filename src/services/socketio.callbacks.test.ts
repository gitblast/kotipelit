import * as callbacks from './socketio.callbacks';
import { CommonEvent, MockSocket } from '../types';

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
});
