import socketService, { attachListeners } from './socketio';
import axios, { AxiosResponse } from 'axios';
import { CommonEvent, MockSocket, PlayerEvent, HostEvent } from '../types';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

const response: AxiosResponse = {
  data: 'token',
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {},
};

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

describe('socketio service', () => {
  beforeEach(() => {
    socket = ({ ...mockSocket } as unknown) as SocketIOClient.Socket;
    socketAsMock = (socket as unknown) as MockSocket;
  });

  describe('attachListeners', () => {
    it('should set common and player listeners for player', () => {
      attachListeners(socket, false);

      expect(socketAsMock.listeners[PlayerEvent.JOIN_SUCCESS]).toEqual(
        expect.any(Function)
      );

      expect(socketAsMock.listeners[PlayerEvent.JOIN_FAILURE]).toEqual(
        expect.any(Function)
      );

      expect(socketAsMock.listeners[PlayerEvent.GAME_STARTING]).toEqual(
        expect.any(Function)
      );

      expect(socketAsMock.listeners[PlayerEvent.GAME_READY]).toEqual(
        expect.any(Function)
      );
    });

    it('should set common and host listeners for host', () => {
      attachListeners(socket, true);

      expect(socketAsMock.listeners[HostEvent.CREATE_SUCCESS]).toEqual(
        expect.any(Function)
      );

      expect(socketAsMock.listeners[HostEvent.CREATE_FAILURE]).toEqual(
        expect.any(Function)
      );

      expect(socketAsMock.listeners[HostEvent.START_SUCCESS]).toEqual(
        expect.any(Function)
      );

      expect(socketAsMock.listeners[HostEvent.START_FAILURE]).toEqual(
        expect.any(Function)
      );
    });
  });

  describe('getTokenForSocket', () => {
    it('should fetch token for player', async () => {
      mockedAxios.get.mockImplementationOnce(() => Promise.resolve(response));

      const token = await socketService.getTokenForSocket('gameID', 'playerID');

      expect(token).toBe('token');
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/api/games/gameID?pelaaja=playerID'
      );
    });
  });

  describe('getAuthenticatedSocket', () => {
    it('should call callback on "connect"', () => {
      socketService.authenticateSocket(socket, 'TOKEN', () => null);

      expect(socketAsMock.listeners[CommonEvent.CONNECT]).toEqual(
        expect.any(Function)
      );
    });
  });
});
