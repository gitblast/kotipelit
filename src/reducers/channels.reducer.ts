import { ThunkAction } from 'redux-thunk';
import userService from '../services/users';

import {
  Action,
  ActionType,
  State,
  HostChannel,
  ChannelsState,
} from '../types';

const initialState: ChannelsState = {
  allChannels: [],
  loading: false,
};

/** @TODO handle errors */

const reducer = (state: ChannelsState = initialState, action: Action) => {
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

export const initChannels = (): ThunkAction<void, State, null, Action> => {
  const request = (): Action => {
    return { type: ActionType.INIT_CHANNELS_REQUEST };
  };

  const success = (channels: HostChannel[]): Action => {
    return { type: ActionType.INIT_CHANNELS_SUCCESS, payload: channels };
  };

  const failure = (): Action => {
    return { type: ActionType.INIT_CHANNELS_FAILURE };
  };

  return async (dispatch) => {
    dispatch(request());

    try {
      const channels = await userService.getAll();
      dispatch(success(channels));
    } catch (error) {
      dispatch(failure());
    }
  };
};

export default reducer;
