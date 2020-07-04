import {
  CommonEvent,
  PlayerEvent,
  HostEvent,
  RecievedError,
  CreateSuccessResponse,
} from '../types';
import { log } from '../utils/logger';
import store from '../store';
import { setJitsiToken } from '../reducers/user.reducer';
import { setActiveGame } from '../reducers/games.reducer';

export const connect = (
  socket: SocketIOClient.Socket,
  token: string,
  callback: Function
) => {
  return () => {
    socket
      .emit(CommonEvent.AUTH_REQUEST, { token })
      .on(CommonEvent.AUTHENTICATED, () => {
        log('socketio authorized');

        callback(socket);
      })
      .on(CommonEvent.UNAUTHORIZED, (error: { message: string }) => {
        log('socketio unauthorized');

        throw new Error(error.message);
      });
  };
};

export const playerJoined = () => () =>
  log(`recieved ${CommonEvent.PLAYER_JOINED}`);

export const createSuccess = (data: CreateSuccessResponse) => {
  log(`recieved ${HostEvent.CREATE_SUCCESS}`);

  store.dispatch(setActiveGame(data.game));
  store.dispatch(setJitsiToken(data.jitsiToken));
};

export const createFailure = (data: RecievedError) =>
  log(`recieved ${HostEvent.CREATE_FAILURE}: ${data.error}`);

export const startSuccess = () => () =>
  log(`recieved ${HostEvent.START_SUCCESS}`);
export const startFailure = (data: RecievedError) =>
  log(`recieved ${HostEvent.START_FAILURE}: ${data.error}`);

export const joinSuccess = () => () =>
  log(`recieved ${PlayerEvent.JOIN_SUCCESS}`);
export const joinFailure = (data: RecievedError) =>
  log(`recieved ${PlayerEvent.JOIN_FAILURE}: ${data.error}`);

export const gameReady = (jitsiRoom: string) => {
  log(`recieved ${PlayerEvent.GAME_READY}`);

  console.log('jitsi room:', jitsiRoom);
};
export const gameStarting = () => () =>
  log(`recieved ${PlayerEvent.GAME_STARTING}`);
