import {
  GamesState,
  Action,
  SelectableGame,
  GameType,
  GameStatus,
  ActiveGame,
  ActionType,
} from '../types';

import { Dispatch, Reducer } from 'redux';

import gameService from '../services/games';

const initialState: GamesState = {
  allGames: [],
  activeGame: null,
  loading: false,
};

const activate = (game: SelectableGame): ActiveGame => {
  switch (game.type) {
    case GameType.KOTITONNI:
      return {
        ...game,
        status: GameStatus.WAITING,
        info: {
          turn: 'TODO',
          round: 1,
        },
      };
    default: {
      throw new Error(
        `Something went wrong, expected a selectable game, got ${game.type}`
      );
    }
  }
};

const reducer: Reducer<GamesState, Action> = (
  state: GamesState = initialState,
  action: Action
) => {
  switch (action.type) {
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
    case ActionType.SET_ACTIVE_GAME: {
      return {
        ...state,
        activeGame: action.payload,
      };
    }
    case 'LAUNCH_GAME': {
      const gameToActivate = state.allGames.find(
        (game) => game.id === action.payload
      );

      if (!gameToActivate) throw new Error(`Game not found`);

      const activatedGame = activate(gameToActivate);

      return {
        ...state,
        activeGame: activatedGame,
        allGames: state.allGames.map((game) =>
          game.id === action.payload
            ? { ...game, status: GameStatus.WAITING }
            : game
        ),
      };
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

export const initSuccess = (games: SelectableGame[]): Action => ({
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

export const addSuccess = (gameToAdd: SelectableGame): Action => {
  return { type: ActionType.ADD_GAME_SUCCESS, payload: gameToAdd };
};

export const addFailure = (): Action => {
  return { type: ActionType.ADD_GAME_FAILURE };
};

export const addGame = (game: Omit<SelectableGame, 'id'>) => {
  return async (dispatch: Dispatch) => {
    dispatch(addRequest());

    try {
      const addedGame = await gameService.addNew(game);
      dispatch(addSuccess(addedGame));
    } catch (error) {
      dispatch(addFailure());
    }
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

export const setGames = (games: SelectableGame[]): Action => ({
  type: ActionType.SET_GAMES,
  payload: games,
});

export const setActiveGame = (game: ActiveGame | null): Action => ({
  type: ActionType.SET_ACTIVE_GAME,
  payload: game,
});

export const launchGame = (id: string): Action => {
  return {
    type: ActionType.LAUNCH_GAME,
    payload: id,
  };
};

export const updateGame = (updatedGame: ActiveGame): Action => {
  return {
    type: ActionType.UPDATE_ACTIVE_GAME,
    payload: updatedGame,
  };
};

export default reducer;
