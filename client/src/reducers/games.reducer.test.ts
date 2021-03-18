import reducer from './games.reducer';
import * as actions from './games.reducer';
import { hardcodedGames } from '../helpers/tests';

import gameService from '../services/games';

import {
  GameType,
  GameStatus,
  Action,
  ActionType,
  GamesState,
  KotitonniPrivateData,
  RTCGame,
} from '../types';

const newGame = {
  startTime: new Date(),
  type: GameType.KOTITONNI,
  status: GameStatus.UPCOMING,
  rounds: 3,
  price: 0,
  id: '123',
  players: [
    {
      id: '1',
      name: 'Risto',
      privateData: {
        words: ['jojo', 'kasvi', 'hattu'],
      } as KotitonniPrivateData,
      points: 0,
    },
  ],
} as RTCGame;

const initializedState = {
  allGames: [newGame],
  loading: false,
};

jest.mock('../services/games', () => ({
  getAll: jest.fn(),
  addNew: jest.fn(),
  deleteGame: jest.fn(),
}));

const getAll: jest.Mock = gameService.getAll as jest.Mock;
const addNew: jest.Mock = gameService.addNew as jest.Mock;
const deleteGame: jest.Mock = gameService.deleteGame as jest.Mock;

describe('games reducer', () => {
  it('should return initial state', () => {
    const initialState = {
      allGames: [],
      loading: false,
    };

    expect(reducer(undefined, {} as Action)).toEqual(initialState);
  });

  it('should handle INIT_GAMES_REQUEST', () => {
    const action: Action = {
      type: ActionType.INIT_GAMES_REQUEST,
    };

    const expectedState: GamesState = {
      allGames: [],
      loading: true,
    };

    expect(reducer(undefined, action)).toEqual(expectedState);
  });

  it('should handle INIT_GAMES_SUCCESS', () => {
    const action: Action = {
      type: ActionType.INIT_GAMES_SUCCESS,
      payload: hardcodedGames,
    };

    const expectedState: GamesState = {
      allGames: hardcodedGames,
      loading: false,
    };

    expect(reducer(undefined, action)).toEqual(expectedState);
  });

  it('should handle INIT_GAMES_FAILURE', () => {
    const action: Action = {
      type: ActionType.INIT_GAMES_FAILURE,
    };

    const expectedState: GamesState = {
      allGames: [],
      loading: false,
    };

    expect(reducer(undefined, action)).toEqual(expectedState);
  });

  it('should handle ADD_GAME_REQUEST', () => {
    const action: Action = {
      type: ActionType.ADD_GAME_REQUEST,
    };

    const expectedState = {
      allGames: [],
      loading: true,
    };

    const stateAfterAdd = reducer(undefined, action);

    expect(stateAfterAdd).toEqual(expectedState);
  });

  it('should handle ADD_GAME_SUCCESS', () => {
    const action: Action = {
      type: ActionType.ADD_GAME_SUCCESS,
      payload: newGame,
    };

    const expectedState = {
      allGames: [newGame],
      loading: false,
    };

    const stateAfterAdd = reducer(undefined, action);

    expect(stateAfterAdd).toEqual(expectedState);
  });

  it('should handle ADD_GAME_FAILURE', () => {
    const action: Action = {
      type: ActionType.ADD_GAME_FAILURE,
    };

    const expectedState = {
      allGames: [],
      loading: false,
    };

    const stateAfterAdd = reducer(undefined, action);

    expect(stateAfterAdd).toEqual(expectedState);
  });

  it('should handle DELETE_GAME_REQUEST', () => {
    const action: Action = {
      type: ActionType.DELETE_GAME_REQUEST,
    };

    const expectedState = {
      allGames: [newGame],
      loading: true,
    };

    expect(reducer(initializedState, action)).toEqual(expectedState);
  });

  it('should handle DELETE_GAME_SUCCESS', () => {
    const action: Action = {
      type: ActionType.DELETE_GAME_SUCCESS,
      payload: newGame.id,
    };

    const expectedState = {
      allGames: [],
      loading: false,
    };

    expect(reducer(initializedState, action)).toEqual(expectedState);
  });

  it('should handle DELETE_GAME_FAILURE', () => {
    const action: Action = {
      type: ActionType.DELETE_GAME_FAILURE,
    };

    const expectedState = {
      allGames: [newGame],
      loading: false,
    };

    expect(reducer(initializedState, action)).toEqual(expectedState);
  });
});

describe('action creators', () => {
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
      info: {
        turn: 'turn',
        round: 1,
        answeringOpen: false,
      },
    };
    const expectedAction = {
      type: 'UPDATE_ACTIVE_GAME',
      payload: updatedGame,
    };

    expect(actions.updateGame(updatedGame)).toEqual(expectedAction);
  });

  describe('async actions', () => {
    let dispatch = jest.fn();

    beforeEach(() => (dispatch = jest.fn()));

    describe('init games', () => {
      it('should dispatch init request', async () => {
        await actions.initGames()(dispatch);
        expect(dispatch).toHaveBeenCalledWith(actions.initRequest());
      });

      describe('when init succeeds', () => {
        beforeEach(() => getAll.mockResolvedValue(hardcodedGames));

        it('should dispatch success with received games', async () => {
          await actions.initGames()(dispatch);
          expect(dispatch).toHaveBeenLastCalledWith(
            actions.initSuccess(hardcodedGames)
          );
        });
      });

      describe('when init fails', () => {
        const error = new Error('error!');

        beforeEach(() => getAll.mockRejectedValue(error));

        it('should dispatch failure', async () => {
          await actions.initGames()(dispatch);
          expect(dispatch).toHaveBeenLastCalledWith(actions.initFailure());
        });
      });
    });

    describe('add game', () => {
      it('should dispatch add request', async () => {
        await actions.addGame(newGame)(dispatch);
        expect(dispatch).toHaveBeenCalledWith(actions.addRequest());
      });

      describe('when add succeeds', () => {
        beforeEach(() => addNew.mockResolvedValue({ ...newGame, id: 'id' }));

        it('should dispatch success with received games', async () => {
          await actions.addGame(newGame)(dispatch);
          expect(dispatch).toHaveBeenLastCalledWith(
            actions.addSuccess({ ...newGame, id: 'id' })
          );
        });
      });

      describe('when add fails', () => {
        const error = new Error('error!');

        beforeEach(() => addNew.mockRejectedValue(error));

        it('should dispatch failure', async () => {
          await actions.addGame(newGame)(dispatch);
          expect(dispatch).toHaveBeenLastCalledWith(actions.addFailure());
        });
      });
    });

    describe('delete game', () => {
      it('should dispatch delete request', async () => {
        await actions.deleteGame('id')(dispatch);
        expect(dispatch).toHaveBeenCalledWith(actions.deleteRequest());
      });

      describe('when delete succeeds', () => {
        beforeEach(() => deleteGame.mockResolvedValue(null));

        it('should dispatch success', async () => {
          await actions.deleteGame('id')(dispatch);
          expect(dispatch).toHaveBeenLastCalledWith(
            actions.deleteSuccess('id')
          );
        });
      });

      describe('when delete fails', () => {
        const error = new Error('error!');

        beforeEach(() => deleteGame.mockRejectedValue(error));

        it('should dispatch failure', async () => {
          await actions.deleteGame('id')(dispatch);
          expect(dispatch).toHaveBeenLastCalledWith(actions.deleteFailure());
        });
      });
    });
  });
});
