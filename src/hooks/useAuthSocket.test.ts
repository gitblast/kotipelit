import { act, renderHook } from '@testing-library/react-hooks';
import useAuthSocket from './useAuthSocket';
import socketIOClient from 'socket.io-client';
import { CommonEvent, MockSocket } from '../types';

// mock socketio
jest.mock('socket.io-client');

const getMockSocket = () =>
  (({
    listeners: {},
    disconnect: jest.fn(),
    connected: true,
    on: jest.fn().mockImplementation(
      // saves the attached listeners in the listeners -object so they can be called later
      function (this: MockSocket, event: string, callback: Function) {
        this.listeners[event] = callback;
        return this;
      }
    ),
    emit: jest.fn(),
  } as unknown) as SocketIOClient.Socket);

describe('useSocket hook', () => {
  const SocketMock = (socketIOClient as unknown) as jest.Mock;
  const token = 'token';

  let mock: SocketIOClient.Socket;

  beforeEach(() => {
    SocketMock.mockClear();

    mock = getMockSocket();

    SocketMock.mockImplementation(() => mock);
  });

  it('should start with socket and error as null', () => {
    const { result } = renderHook(({ token }) => useAuthSocket(token), {
      initialProps: { token: null },
    });

    expect(result.current.length).toBe(2);
    expect(result.current[0]).toBeNull();
    expect(result.current[1]).toBeNull();
  });

  it('should call init socket if not already set when token becomes not null', () => {
    const initialProps: { token: null | string } = {
      token: null,
    };

    const { rerender } = renderHook(({ token }) => useAuthSocket(token), {
      initialProps,
    });

    expect(SocketMock).not.toHaveBeenCalled();

    rerender({ token: 'token' });

    expect(SocketMock).toHaveBeenCalled();
  });

  it('should init socket only if not set', () => {
    const { result } = renderHook(({ token }) => useAuthSocket(token), {
      initialProps: { token },
    });

    const asMock = (mock as unknown) as MockSocket;

    expect(result.current[0]).toBeNull();
    expect(SocketMock).toHaveBeenCalledTimes(1);

    // sets auth listener
    asMock.listeners[CommonEvent.CONNECT]();

    // sets socket
    act(() => {
      asMock.listeners[CommonEvent.AUTHENTICATED]();
    });

    expect(result.current[0]).not.toBeNull();
    expect(SocketMock).toHaveBeenCalledTimes(1);
  });

  it('should attach listener for connect', () => {
    renderHook(({ token }) => useAuthSocket(token), {
      initialProps: { token: 'token' },
    });

    expect(SocketMock).toHaveBeenCalled();

    expect(mock.on).toHaveBeenCalledWith(
      CommonEvent.CONNECT,
      expect.any(Function)
    );
  });

  it('should emit auth request and attach auth listeners on connect', () => {
    renderHook(({ token }) => useAuthSocket(token), {
      initialProps: { token },
    });

    expect(SocketMock).toHaveBeenCalled();

    const asMock = (mock as unknown) as MockSocket;

    expect(asMock.emit).not.toHaveBeenCalled();
    expect(asMock.on).not.toHaveBeenCalledWith(
      CommonEvent.AUTHENTICATED,
      expect.any(Function)
    );
    expect(asMock.on).not.toHaveBeenCalledWith(
      CommonEvent.UNAUTHORIZED,
      expect.any(Function)
    );

    asMock.listeners[CommonEvent.CONNECT]();

    expect(asMock.emit).toHaveBeenCalledWith(CommonEvent.AUTH_REQUEST, {
      token,
    });
    expect(asMock.on).toHaveBeenCalledWith(
      CommonEvent.AUTHENTICATED,
      expect.any(Function)
    );
    expect(asMock.on).toHaveBeenCalledWith(
      CommonEvent.UNAUTHORIZED,
      expect.any(Function)
    );
  });

  it('should set socket on authenticated', () => {
    const { result } = renderHook(({ token }) => useAuthSocket(token), {
      initialProps: { token },
    });

    const asMock = (mock as unknown) as MockSocket;

    asMock.listeners[CommonEvent.CONNECT]();

    expect(result.current[0]).toBeNull();

    act(() => {
      asMock.listeners[CommonEvent.AUTHENTICATED]();
    });

    expect(result.current[0]).toBe(mock);
  });

  it('should set error on unauthorized', () => {
    const { result } = renderHook(({ token }) => useAuthSocket(token), {
      initialProps: { token },
    });

    const asMock = (mock as unknown) as MockSocket;

    asMock.listeners[CommonEvent.CONNECT]();

    expect(result.current[1]).toBeNull();

    act(() => {
      asMock.listeners[CommonEvent.UNAUTHORIZED]({ message: 'error msg' });
    });

    expect(result.current[1]).toBe('error msg');
  });

  it('should call disconnect as cleanup if socket is set', () => {
    const { result, unmount } = renderHook(
      ({ token }) => useAuthSocket(token),
      {
        initialProps: { token },
      }
    );

    const asMock = (mock as unknown) as MockSocket;

    asMock.listeners[CommonEvent.CONNECT]();

    act(() => {
      asMock.listeners[CommonEvent.AUTHENTICATED]();
    });

    if (!result.current[0]) {
      throw new Error('expected socket to not be null');
    }

    expect(result.current[0].disconnect).not.toHaveBeenCalled();

    unmount();

    expect(result.current[0].disconnect).toHaveBeenCalled();
  });
});
