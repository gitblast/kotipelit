import { emit } from './socketio';
import { jitsiReady } from './socketio.events';

export const emitJitsiReady = (
  socket: SocketIOClient.Socket,
  gameId: string,
  jitsiRoom: string
): void => {
  emit(socket, jitsiReady(gameId, jitsiRoom));
};
