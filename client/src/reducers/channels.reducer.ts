import userService from '../services/users';

import { Action, ActionType, HostChannel, ChannelsState } from '../types';
import { Dispatch, Reducer } from 'redux';

const initialState: ChannelsState = {
  allChannels: [],
  loading: false,
};

/** @TODO handle errors */

const reducer: Reducer<ChannelsState, Action> = (
  state: ChannelsState = initialState,
  action: Action
) => {
  switch (action.type) {
    case ActionType.INIT_CHANNELS_REQUEST:
      return { ...state, loading: true };
    case ActionType.INIT_CHANNELS_SUCCESS:
      return { allChannels: action.payload, loading: false };
    case ActionType.INIT_CHANNELS_FAILURE: {
      return { ...state, loading: false };
    }
    default:
      return state;
  }
};

export const initRequest = (): Action => ({
  type: ActionType.INIT_CHANNELS_REQUEST,
});

export const initSuccess = (channels: HostChannel[]): Action => ({
  type: ActionType.INIT_CHANNELS_SUCCESS,
  payload: channels,
});
export const initFailure = (): Action => ({
  type: ActionType.INIT_CHANNELS_FAILURE,
});

export const initChannels = () => {
  return async (dispatch: Dispatch) => {
    dispatch(initRequest());

    try {
      const channels = await userService.getAll();
      dispatch(initSuccess(channels));
    } catch (error) {
      dispatch(initFailure());
    }
  };
};

export default reducer;
