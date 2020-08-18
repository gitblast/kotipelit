import {
  CommonEvent,
  PlayerEvent,
  HostEvent,
  RecievedError,
  CreateSuccessResponse,
  ActiveGame,
  JoinSuccessResponse,
  GameStatus,
} from '../../types';
import { log } from '../../utils/logger';
import store from '../../store';
import { setJitsiToken, setJitsiRoom } from '../../reducers/user.reducer';
import { setActiveGame, setGames } from '../../reducers/games.reducer';
import socketService from './service';
import * as events from './events';
import { setError, clearError } from '../../reducers/alert.reducer';

/** @TODO handle error on connect */
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

  const currentGame = store.getState().games.activeGame;

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

/** HOST */

export const createSuccess = (data: CreateSuccessResponse) => {
  log(`recieved ${HostEvent.CREATE_SUCCESS}, data:`);
  log(data);

  store.dispatch(setJitsiRoom(data.jitsiRoom));
  store.dispatch(setActiveGame(data.game));
  store.dispatch(setJitsiToken(data.jitsiToken));
};

export const createFailure = (data: RecievedError) =>
  log(`recieved ${HostEvent.CREATE_FAILURE}: ${data.error}`);

export const updateSuccess = (game: ActiveGame) => {
  log(`recieved ${HostEvent.UPDATE_SUCCESS}, data:`);
  log(game);

  store.dispatch(setActiveGame(game));
};

export const updateFailure = (data: RecievedError) =>
  log(`recieved ${HostEvent.UPDATE_FAILURE}: ${data.error}`);

export const startSuccess = (startedGame: ActiveGame) => {
  log(`recieved ${HostEvent.START_SUCCESS}:`);
  log(startedGame);

  store.dispatch(setActiveGame(startedGame));
};
export const startFailure = (data: RecievedError) =>
  log(`recieved ${HostEvent.START_FAILURE}: ${data.error}`);

export const endSuccess = (gameId: string) => {
  log(`recieved ${HostEvent.END_SUCCESS}:`);

  const { allGames, activeGame } = store.getState().games;

  if (activeGame) {
    const newGames = allGames.map((game) =>
      game.id === gameId
        ? { ...game, status: GameStatus.FINISHED, players: activeGame.players }
        : game
    );

    store.dispatch(setGames(newGames));

    store.dispatch(
      setActiveGame({ ...activeGame, status: GameStatus.FINISHED })
    );
  }
};

export const endFailure = (data: RecievedError) => {
  log(`recieved ${HostEvent.END_FAILURE}: ${data.error}`);
};

/** PLAYER */

export const joinSuccess = (data: JoinSuccessResponse) => {
  log(`recieved ${PlayerEvent.JOIN_SUCCESS}:`);
  log(data);

  store.dispatch(clearError());
  store.dispatch(setJitsiRoom(data.jitsiRoom));
  store.dispatch(setActiveGame(data.game));
};

export const joinFailure = (data: RecievedError) => {
  log(`recieved ${PlayerEvent.JOIN_FAILURE}: ${data.error}`);

  store.dispatch(setError('Host ei ole vielä käynnistänyt peliä.'));
};

export const gameReady = () => {
  log(`recieved ${PlayerEvent.GAME_READY}`);

  try {
    const socket = store.getState().user.socket;

    if (!socket) throw new Error('No socket set for user');

    socketService.emit(socket, events.joinGame());
  } catch (error) {
    console.error(error.message);
  }
};

export const gameStarting = (game: ActiveGame) => {
  log(`recieved ${PlayerEvent.GAME_STARTING}:`);
  log(game);

  store.dispatch(setActiveGame(game));
};

export const gameUpdated = (game: ActiveGame) => {
  log(`recieved ${PlayerEvent.GAME_UPDATED}:`);
  log(game);

  store.dispatch(setActiveGame(game));
};

export const gameEnded = () => {
  log(`recieved ${PlayerEvent.GAME_ENDED}:`);

  const activeGame = store.getState().games.activeGame;

  if (activeGame) {
    store.dispatch(
      setActiveGame({ ...activeGame, status: GameStatus.FINISHED })
    );
  }
};
