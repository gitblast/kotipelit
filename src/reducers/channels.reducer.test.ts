import reducer from './channels.reducer';
import * as actions from './channels.reducer';
import userService from '../services/users';

import { hardcodedChannels } from '../constants';
import { ChannelsState, Action, ActionType } from '../types';

const getAll: jest.Mock = userService.getAll as jest.Mock;

jest.mock('../services/users', () => ({
  getAll: jest.fn(),
}));

const initialState: ChannelsState = {
  allChannels: [],
  loading: false,
};

describe('channels reducer', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, {} as Action)).toEqual(initialState);
  });

  it('should handle INIT_CHANNELS_REQUEST', () => {
    const action: Action = {
      type: ActionType.INIT_CHANNELS_REQUEST,
    };

    const expectedState: ChannelsState = {
      allChannels: [],
      loading: true,
    };

    expect(reducer(undefined, action)).toEqual(expectedState);
  });

  it('should handle INIT_CHANNELS_SUCCESS', () => {
    const action: Action = {
      type: ActionType.INIT_CHANNELS_SUCCESS,
      payload: hardcodedChannels,
    };

    const expectedState: ChannelsState = {
      allChannels: hardcodedChannels,
      loading: false,
    };

    expect(reducer(undefined, action)).toEqual(expectedState);
  });

  it('should handle INIT_CHANNELS_FAILURE', () => {
    const action: Action = {
      type: ActionType.INIT_GAMES_FAILURE,
    };

    const expectedState: ChannelsState = {
      allChannels: [],
      loading: false,
    };

    expect(reducer(undefined, action)).toEqual(expectedState);
  });

  describe('async actions', () => {
    let dispatch = jest.fn();

    beforeEach(() => (dispatch = jest.fn()));

    describe('init channels', () => {
      it('should dispatch init request', async () => {
        await actions.initChannels()(dispatch);
        expect(dispatch).toHaveBeenCalledWith(actions.initRequest());
      });

      describe('when init succeeds', () => {
        beforeEach(() => getAll.mockResolvedValue(hardcodedChannels));

        it('should dispatch success with received games', async () => {
          await actions.initChannels()(dispatch);
          expect(dispatch).toHaveBeenLastCalledWith(
            actions.initSuccess(hardcodedChannels)
          );
        });
      });

      describe('when init fails', () => {
        const error = new Error('error!');

        beforeEach(() => getAll.mockRejectedValue(error));

        it('should dispatch failure', async () => {
          await actions.initChannels()(dispatch);
          expect(dispatch).toHaveBeenLastCalledWith(actions.initFailure());
        });
      });
    });
  });
});
