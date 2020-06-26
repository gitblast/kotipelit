import {
  GamesState,
  Action,
  SelectableGame,
  GameType,
  GameStatus,
  ActiveGame,
  ActionType,
  State,
} from '../types';

import gameService from '../services/games';

import { ThunkAction } from 'redux-thunk';

const initialState: GamesState = {
  allGames: [],
  activeGame: null,
  loading: false,
};

const activate = (game: SelectableGame): ActiveGame => {
  switch (game.type) {
    case GameType.SANAKIERTO:
      return {
        ...game,
        status: GameStatus.WAITING,
        turn: 0,
        round: 1,
      };
    default: {
      throw new Error(
        `Something went wrong, expected a selectable game, got ${game.type}`
      );
    }
  }
};

const reducer = (state: GamesState = initialState, action: Action) => {
  switch (action.type) {
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
      const gameToActivate = state.allGames.find(
        (game) => game.id === action.payload
      );

      if (!gameToActivate) throw new Error(`Game not found`);

      const activatedGame = activate(gameToActivate);

      return {
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

export const initGames = (): ThunkAction<void, State, null, Action> => {
  const request = (): Action => {
    return { type: ActionType.INIT_GAMES_REQUEST };
  };

  const success = (games: SelectableGame[]): Action => {
    return { type: ActionType.INIT_GAMES_SUCCESS, payload: games };
  };

  const failure = (): Action => {
    return { type: ActionType.INIT_GAMES_FAILURE };
  };

  return async (dispatch) => {
    dispatch(request());

    try {
      const games = await gameService.getAll();
      dispatch(success(games));
    } catch (error) {
      dispatch(failure());
    }
  };
};

export const addGame = (
  game: Omit<SelectableGame, 'id'>
): ThunkAction<void, State, null, Action> => {
  const request = (): Action => {
    return { type: ActionType.ADD_GAME_REQUEST };
  };

  const success = (gameToAdd: SelectableGame): Action => {
    return { type: ActionType.ADD_GAME_SUCCESS, payload: gameToAdd };
  };

  const failure = (): Action => {
    return { type: ActionType.ADD_GAME_FAILURE };
  };

  return async (dispatch) => {
    dispatch(request());

    try {
      const addedGame = await gameService.addNew(game);
      dispatch(success(addedGame));
    } catch (error) {
      dispatch(failure());
    }
  };
};

export const deleteGame = (
  idToRemove: string
): ThunkAction<void, State, null, Action> => {
  const request = (): Action => {
    return { type: ActionType.DELETE_GAME_REQUEST };
  };

  const success = (id: string): Action => {
    return { type: ActionType.DELETE_GAME_SUCCESS, payload: id };
  };

  const failure = (): Action => {
    return { type: ActionType.DELETE_GAME_FAILURE };
  };

  return async (dispatch) => {
    dispatch(request());

    try {
      await gameService.deleteGame(idToRemove);
      dispatch(success(idToRemove));
    } catch (error) {
      dispatch(failure());
    }
  };
};

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
