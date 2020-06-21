import {
  GamesState,
  Action,
  SelectableGame,
  GameType,
  GameStatus,
  ActiveGame,
  ActionType,
} from '../types';

import { hardcodedGames } from '../constants';

const initialState = {
  allGames: [],
  activeGame: null,
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
    case 'INIT_GAMES': {
      return {
        ...state,
        allGames: action.payload,
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

/** @TODO fetch from backend */
export const initGames = (): Action => {
  return {
    type: ActionType.INIT_GAMES,
    payload: hardcodedGames,
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
