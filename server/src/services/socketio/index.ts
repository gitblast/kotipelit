import { Server } from 'socket.io';
import { authorize } from '@thream/socketio-jwt';
import config from '../../utils/config';
import logger from '../../utils/logger';
import * as callbacks from './socketio.callbacks';

import { SocketWithToken, Role, Answer, GameUpdate } from '../../types';
import { setupChangeStreams } from '../changeStream';

const attachRTCListeners = (socket: SocketWithToken) => {
  logger.log('attaching listeners');

  // can handle game types here

  socket.on('get-twilio-token', (setToken: (token: string) => void) => {
    void callbacks.getTwilioToken(socket, setToken);
  });

  socket.on('get-game', () => {
    void callbacks.getGame(socket);
  });

  socket.on('disconnect', (reason: string) => {
    void callbacks.socketDisconnected(socket, reason);
  });

  if (socket.decodedToken.role === Role.PLAYER) {
    socket.on('answer', (answerObj: Answer) => {
      void callbacks.handleAnswer(socket, answerObj);
    });
  }

  if (socket.decodedToken.role === Role.HOST) {
    socket.on('launch', (setToken: (token: string) => void) => {
      void callbacks.launchRTCGame(socket, setToken);
    });

    socket.on('start', () => {
      void callbacks.startRTCGame(socket);
    });

    socket.on('end', () => {
      void callbacks.endRTCGame(socket);
    });

    socket.on('update-game', (update: GameUpdate) => {
      void callbacks.updateRTCGame(socket, update);
    });

    socket.on('handle-timer', (command: 'start' | 'stop' | 'reset') => {
      void callbacks.handleTimer(socket, command);
    });

    socket.on('set-player-muted', (playerId: string, muted: boolean) => {
      void callbacks.handleMute(socket, playerId, muted);
    });
  }
};

const handler = (io: Server): void => {
  // authenticate
  io.of('/').use(
    authorize({
      secret: config.SECRET,
    })
  );

  setupChangeStreams(io);

  io.of('/').on('connection', (socket: SocketWithToken) => {
    const { id, gameId, role, username } = socket.decodedToken;

    logger.log(`[${role}] '${username}' connected (${id})`);

    attachRTCListeners(socket);

    /** This makes existing connections from the same id disconnect */

    socket.to(id).emit('duplicate');

    /** This makes it easy to send updates to given user */

    socket.join(id);

    socket.join(gameId);

    /** This makes it easy to send different stuff to host/players/spectators without knowing their socket id:s */

    socket.join(`${gameId}/${role}`);

    /** This emits game to socket */

    void callbacks.getGame(socket);
  });
};

export default handler;
