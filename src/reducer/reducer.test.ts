import reducer from './reducer';
import * as actions from './reducer';
import { hardcodedGames } from '../constants';

import {
  GameType,
  GameStatus,
  SelectableGame,
  Action,
  ActionType,
  State,
} from '../types';

const newGame: SelectableGame = {
  startTime: new Date(),
  type: GameType.SANAKIERTO,
  status: GameStatus.UPCOMING,
  rounds: 3,
  id: '123',
  players: [
    {
      id: '1',
      name: 'Risto',
      words: ['jojo', 'kasvi', 'hattu'],
      points: 0,
    },
  ],
};

const initializedState = {
  games: [newGame],
  activeGame: null,
};

describe('Reducer', () => {
  it('should return initial state', () => {
    const initialState = {
      games: [],
      activeGame: null,
    };

    expect(reducer(undefined, {} as Action)).toEqual(initialState);
  });

  it('should handle INIT_GAMES', () => {
    const action: Action = {
      type: ActionType.INIT_GAMES,
      payload: hardcodedGames,
    };

    const expectedState = {
      games: hardcodedGames,
      activeGame: null,
    };

    expect(reducer(undefined, action)).toEqual(expectedState);
  });

  it('should handle ADD_GAME', () => {
    const action: Action = {
      type: ActionType.ADD_GAME,
      payload: newGame,
    };

    const expectedState = {
      games: [newGame],
      activeGame: null,
    };

    const stateAfterAdd = reducer(undefined, action);

    expect(stateAfterAdd).toEqual(expectedState);
  });

  it('should handle DELETE_GAME', () => {
    const action: Action = {
      type: ActionType.DELETE_GAME,
      payload: newGame.id,
    };

    const expectedState = {
      games: [],
      activeGame: null,
    };

    expect(reducer(initializedState, action)).toEqual(expectedState);
  });

  it('should handle LAUNCH_GAME', () => {
    const action: Action = {
      type: ActionType.LAUNCH_GAME,
      payload: newGame.id,
    };

    expect(() => reducer(undefined, action)).toThrow('Game not found');

    const invalidState = {
      games: [{ ...newGame, type: 'INVALID_TYPE' }],
      activeGame: null,
    };

    expect(() => reducer(invalidState as State, action)).toThrow(
      `Something went wrong, expected a selectable game, got INVALID_TYPE`
    );

    const newState = reducer(initializedState, action);

    const expectedState = {
      games: [{ ...newGame, status: GameStatus.WAITING }],
      activeGame: { ...newGame, status: GameStatus.WAITING, round: 1, turn: 0 },
    };

    expect(newState).toEqual(expectedState);
  });

  it('should handle UPDATE_ACTIVE_GAME', () => {
    const updatedGame = {
      ...newGame,
      status: GameStatus.RUNNING,
      round: 2,
      turn: 1,
    };

    const action: Action = {
      type: ActionType.UPDATE_ACTIVE_GAME,
      payload: updatedGame,
    };

    const expectedState = {
      ...initializedState,
      activeGame: updatedGame,
    };

    expect(reducer(initializedState, action)).toEqual(expectedState);
  });
});

describe('action creators', () => {
  it('should create an action to init games', () => {
    const expectedAction = {
      type: 'INIT_GAMES',
      payload: hardcodedGames,
    };

    expect(actions.initGames()).toEqual(expectedAction);
  });

  it('should create an action to add game', () => {
    const expectedAction = {
      type: 'ADD_GAME',
      payload: newGame,
    };

    expect(actions.addGame(newGame)).toEqual(expectedAction);
  });

  it('should create an action to delete game', () => {
    const id = '123';
    const expectedAction = {
      type: 'DELETE_GAME',
      payload: id,
    };

    expect(actions.deleteGame(id)).toEqual(expectedAction);
  });

  it('should create an action to launch game', () => {
    const id = '123';
    const expectedAction = {
      type: 'LAUNCH_GAME',
      payload: id,
    };

    expect(actions.launchGame(id)).toEqual(expectedAction);
  });

  it('should create an action to update game', () => {
    const updatedGame = {
      ...newGame,
      turn: 0,
      round: 1,
    };
    const expectedAction = {
      type: 'UPDATE_ACTIVE_GAME',
      payload: updatedGame,
    };

    expect(actions.updateGame(updatedGame)).toEqual(expectedAction);
  });
});
