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

import { hardcodedGames } from '../constants';
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
    case 'ADD_GAME': {
      return {
        ...state,
        allGames: state.allGames.concat(action.payload),
      };
    }
    case 'DELETE_GAME': {
      return {
        ...state,
        allGames: state.allGames.filter((game) => game.id !== action.payload),
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

export const addGame = (game: SelectableGame): Action => {
  return {
    type: ActionType.ADD_GAME,
    payload: game,
  };
};

export const deleteGame = (id: string): Action => {
  return {
    type: ActionType.DELETE_GAME,
    payload: id,
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
