import { GamesState, Action, RTCGame, GameStatus, ActionType } from '../types';

import { Dispatch, Reducer } from 'redux';

import gameService from '../services/games';

const initialState: GamesState = {
  allGames: [],
  loading: false,
};

const reducer: Reducer<GamesState, Action> = (
  state: GamesState = initialState,
  action: Action
) => {
  switch (action.type) {
    case ActionType.ADD_LOCAL_GAME: {
      return {
        ...state,
        allGames: state.allGames.concat(action.payload),
      };
    }
    case ActionType.SET_GAMES: {
      return {
        ...state,
        allGames: action.payload,
      };
    }
    case ActionType.INIT_GAMES_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case ActionType.INIT_GAMES_SUCCESS: {
      return {
        ...state,
        allGames: action.payload,
        loading: false,
      };
    }
    case ActionType.INIT_GAMES_FAILURE: {
      return {
        ...state,
        loading: false,
      };
    }
    case ActionType.ADD_GAME_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case ActionType.ADD_GAME_SUCCESS: {
      return {
        ...state,
        allGames: state.allGames.concat(action.payload),
        loading: false,
      };
    }
    case ActionType.ADD_GAME_FAILURE: {
      return {
        ...state,
        loading: false,
      };
    }
    case ActionType.DELETE_GAME_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case ActionType.DELETE_GAME_SUCCESS: {
      return {
        ...state,
        allGames: state.allGames.filter((game) => game.id !== action.payload),
        loading: false,
      };
    }
    case ActionType.DELETE_GAME_FAILURE: {
      return {
        ...state,
        loading: false,
      };
    }
    case 'LAUNCH_GAME': {
      return state;
    }
    case 'UPDATE_ACTIVE_GAME': {
      return {
        ...state,
        activeGame: action.payload,
      };
    }
    default:
      return state;
  }
};

export const initRequest = (): Action => ({
  type: ActionType.INIT_GAMES_REQUEST,
});

export const initSuccess = (games: RTCGame[]): Action => ({
  type: ActionType.INIT_GAMES_SUCCESS,
  payload: games,
});

export const initFailure = (): Action => ({
  type: ActionType.INIT_GAMES_FAILURE,
});

export const initGames = () => {
  return async (dispatch: Dispatch) => {
    dispatch(initRequest());

    try {
      const games = await gameService.getAll();
      dispatch(initSuccess(games));
    } catch (error) {
      dispatch(initFailure());
    }
  };
};

// add game

export const addRequest = (): Action => {
  return { type: ActionType.ADD_GAME_REQUEST };
};

export const addSuccess = (gameToAdd: RTCGame): Action => {
  return { type: ActionType.ADD_GAME_SUCCESS, payload: gameToAdd };
};

export const addFailure = (): Action => {
  return { type: ActionType.ADD_GAME_FAILURE };
};

export const addGame = (game: Omit<RTCGame, 'id'>) => {
  return async (dispatch: Dispatch) => {
    dispatch(addRequest());

    try {
      const addedGame = await gameService.addNew(game);
      dispatch(addSuccess(addedGame));

      return addedGame;
    } catch (error) {
      dispatch(addFailure());
    }
  };
};

export const addLocalGame = (game: RTCGame) => {
  return {
    type: ActionType.ADD_LOCAL_GAME,
    payload: game,
  };
};

// delete game

export const deleteRequest = (): Action => ({
  type: ActionType.DELETE_GAME_REQUEST,
});

export const deleteSuccess = (id: string): Action => ({
  type: ActionType.DELETE_GAME_SUCCESS,
  payload: id,
});

export const deleteFailure = (): Action => ({
  type: ActionType.DELETE_GAME_FAILURE,
});

export const deleteGame = (idToRemove: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(deleteRequest());

    try {
      await gameService.deleteGame(idToRemove);
      dispatch(deleteSuccess(idToRemove));
    } catch (error) {
      dispatch(deleteFailure());
    }
  };
};

export const setGames = (games: RTCGame[]): Action => ({
  type: ActionType.SET_GAMES,
  payload: games,
});

export const launchGame = (id: string): Action => {
  return {
    type: ActionType.LAUNCH_GAME,
    payload: id,
  };
};

export const updateGame = (updatedGame: RTCGame): Action => {
  return {
    type: ActionType.UPDATE_ACTIVE_GAME,
    payload: updatedGame,
  };
};

export default reducer;
