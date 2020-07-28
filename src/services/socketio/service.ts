import axios from 'axios';
import {
  CommonEvent,
  HostEvent,
  PlayerEvent,
  EmittedEvent,
  RecievedError,
  CreateSuccessResponse,
  ActiveGame,
  JoinSuccessResponse,
} from '../../types';

import * as callbacks from './callbacks';
import { log } from '../../utils/logger';

const attachListeners = (socket: SocketIOClient.Socket, isHost: boolean) => {
  // default listeners

  socket.on(CommonEvent.PLAYER_JOINED, (data: string) =>
    callbacks.playerJoined(data)
  );

  if (isHost) {
    // host listeners

    socket.on(HostEvent.CREATE_SUCCESS, (data: CreateSuccessResponse) =>
      callbacks.createSuccess(data)
    );
    socket.on(HostEvent.CREATE_FAILURE, (data: RecievedError) =>
      callbacks.createFailure(data)
    );

    socket.on(HostEvent.START_SUCCESS, (game: ActiveGame) => {
      callbacks.startSuccess(game);
    });
    socket.on(HostEvent.START_FAILURE, (data: RecievedError) =>
      callbacks.startFailure(data)
    );

    socket.on(HostEvent.UPDATE_SUCCESS, (game: ActiveGame) =>
      callbacks.updateSuccess(game)
    );
    socket.on(HostEvent.UPDATE_FAILURE, (data: RecievedError) =>
      callbacks.updateFailure(data)
    );
  } else {
    // player listeners

    socket.on(PlayerEvent.JOIN_SUCCESS, (data: JoinSuccessResponse) =>
      callbacks.joinSuccess(data)
    );
    socket.on(PlayerEvent.JOIN_FAILURE, (data: RecievedError) =>
      callbacks.joinFailure(data)
    );

    socket.on(PlayerEvent.GAME_READY, callbacks.gameReady);

    socket.on(PlayerEvent.GAME_STARTING, (game: ActiveGame) =>
      callbacks.gameStarting(game)
    );

    socket.on(PlayerEvent.GAME_UPDATED, (game: ActiveGame) =>
      callbacks.gameUpdated(game)
    );
  }
};

const emit = (socket: SocketIOClient.Socket, eventObj: EmittedEvent): void => {
  const { event, data } = eventObj;

  log(`Emitting ${event}`);

  if (data) {
    log('Data:');
    log(data);
  }

  socket.emit(event, data);
};

const getTokenForSocket = async (
  gameId: string,
  playerId: string
): Promise<string> => {
  const response = await axios.get(`/api/games/${gameId}?pelaaja=${playerId}`);
  return response.data;
};

const authenticateSocket = (
  socket: SocketIOClient.Socket,
  token: string,
  callback: Function
): SocketIOClient.Socket => {
  socket.on(CommonEvent.CONNECT, callbacks.connect(socket, token, callback));

  return socket;
};

export default {
  getTokenForSocket,
  authenticateSocket,
  attachListeners,
  emit,
};
