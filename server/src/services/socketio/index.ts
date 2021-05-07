/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Server } from 'socket.io';
import { authorize } from '@thream/socketio-jwt';
import config from '../../utils/config';
import logger from '../../utils/logger';
import * as callbacks from './socketio.callbacks';

import { SocketWithToken, Role, RTCGame, Answer } from '../../types';
import { TimerData } from '../../utils/timer';
import { setupChangeStreams } from '../changeStream';

const attachRTCListeners = (socket: SocketWithToken) => {
  logger.log('attaching listeners');

  // can handle game types here

  socket.on('get-timer-state', (callback: (data: TimerData) => void) => {
    void callbacks.getTimerState(socket, callback);
  });

  socket.on('get-room-state', () => {
    void callbacks.getRoomState(socket);
  });

  socket.on('get-twilio-token', (setToken: (token: string) => void) => {
    void callbacks.getTwilioToken(socket, setToken);
  });

  socket.on('join-room', () => {
    void callbacks.joinRTCRoom(socket);
  });

  socket.on('get-room-game', () => {
    void callbacks.getRoomGame(socket);
  });

  socket.on('disconnect', (reason: string) => {
    void callbacks.socketDisconnected(socket, reason);
  });

  socket.on('leave-room', () => {
    void callbacks.leaveRTCRoom(socket);
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

    socket.on('update-game', (game: RTCGame) => {
      void callbacks.updateRTCGame(socket, game);
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

    /** This makes it easy to send updates to given user */

    socket.join(id);

    socket.join(gameId);

    /** this makes it easy to send different stuff to host/players/spectators without knowing their socket id:s */

    socket.join(`${gameId}/${role}`);

    void callbacks.getRoomGame(socket);
  });
};

export default handler;
