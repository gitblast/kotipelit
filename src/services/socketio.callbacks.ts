import {
  CommonEvent,
  PlayerEvent,
  HostEvent,
  RecievedError,
  CreateSuccessResponse,
  ActiveGame,
  State,
  JoinSuccessResponse,
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

export const playerJoined = (playerId: string) => {
  log(`recieved ${CommonEvent.PLAYER_JOINED}`);

  const state: State = store.getState();

  const currentGame = state.games.activeGame;

  if (!currentGame) throw new Error('Player joined but no active game is set');

  const newPlayers = currentGame.players.map((player) => {
    return player.id === playerId ? { ...player, online: true } : player;
  });

  store.dispatch(
    setActiveGame({
      ...currentGame,
      players: newPlayers,
    })
  );
};

export const createSuccess = (data: CreateSuccessResponse) => {
  log(`recieved ${HostEvent.CREATE_SUCCESS}, data:`);
  log(data);

  store.dispatch(setActiveGame(data.game));
  store.dispatch(setJitsiToken(data.jitsiToken));
};

export const createFailure = (data: RecievedError) =>
  log(`recieved ${HostEvent.CREATE_FAILURE}: ${data.error}`);

export const startSuccess = (startedGame: ActiveGame) => {
  log(`recieved ${HostEvent.START_SUCCESS}:`);
  log(startedGame);

  store.dispatch(setActiveGame(startedGame));
};
export const startFailure = (data: RecievedError) =>
  log(`recieved ${HostEvent.START_FAILURE}: ${data.error}`);

export const joinSuccess = (data: JoinSuccessResponse) => {
  log(`recieved ${PlayerEvent.JOIN_SUCCESS}:`);
  log(data);

  log('HANDLE JITSI ROOM! ehkä jitsiroom pelin yhteyteen???');
  store.dispatch(setActiveGame(data.game));
};

export const joinFailure = (data: RecievedError) =>
  log(`recieved ${PlayerEvent.JOIN_FAILURE}: ${data.error}`);

export const gameReady = (jitsiRoom: string) => {
  log(`recieved ${PlayerEvent.GAME_READY}`);

  console.log('handle jitsi room:', jitsiRoom);
};
export const gameStarting = (game: ActiveGame) => {
  log(`recieved ${PlayerEvent.GAME_STARTING}:`);
  log(game);

  store.dispatch(setActiveGame(game));
};
