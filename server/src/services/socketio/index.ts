/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Server } from 'socket.io';
import { authorize } from '@thream/socketio-jwt';
import config from '../../utils/config';
import logger from '../../utils/logger';
import * as callbacks from './socketio.callbacks';

import { SocketWithToken, Role, RTCGame, Answer } from '../../types';

const attachRTCListeners = (socket: SocketWithToken) => {
  logger.log('attaching listeners');

  // can handle game types here

  socket.on('join-room', () => {
    void callbacks.joinRTCRoom(socket);
  });

  socket.on('get-room-game', () => {
    void callbacks.getRoomGame(socket);
  });

  socket.on('answer', (answerObj: Answer) => {
    void callbacks.handleAnswer(socket, answerObj);
  });

  socket.on('disconnect', (reason: string) => {
    void callbacks.socketDisconnected(socket, reason);
  });

  socket.on('leave-room', () => {
    void callbacks.leaveRTCRoom(socket);
  });

  if (socket.decodedToken.role === Role.HOST) {
    socket.on('launch', () => {
      void callbacks.launchRTCGame(socket);
    });

    socket.on('start', () => {
      void callbacks.startRTCGame(socket);
    });

    socket.on('end', () => {
      void callbacks.endRTCGame(socket);
    });

    socket.on('update-game', (game: RTCGame) => {
      void callbacks.updateRTCGame(socket, game);
    });

    socket.on('timer', (value: number) => {
      void callbacks.handleTimerChange(socket, value);
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

  io.of('/').on('connection', (socket: SocketWithToken) => {
    logger.log(
      `user connected ${socket.decodedToken.username} with socket id '${socket.id}'`
    );

    const { type, gameId } = socket.decodedToken;

    if (type === 'rtc') {
      logger.log(`joining channel ${gameId}`);

      socket.join(gameId);

      attachRTCListeners(socket);
    } else {
      logger.error('socket type not recognized');
    }
  });
};

export default handler;
