import { MediaConnection } from 'peerjs';
import callHelpers from './call';

interface MockCall {
  peer: string;
  listeners: Record<string, Function>;
  on: (event: string, cb: Function) => void;
}

const callMock: MockCall = {
  peer: 'peerId',
  listeners: {},
  on: function (event: string, callback: Function) {
    this.listeners[event] = callback;
    return this;
  },
};

describe('call helpers', () => {
  const mockStream = { mock: true };

  it('attachCallListeners should set onCall -cb to be called on "stream"', () => {
    const onCall = jest.fn();

    callHelpers.attachCallListeners(
      (callMock as unknown) as MediaConnection,
      onCall
    );

    expect(callMock.listeners['stream']).toEqual(expect.any(Function));

    callMock.listeners['stream'](mockStream);

    expect(onCall).toHaveBeenCalledWith(callMock, mockStream);
  });
});
