import { Reducer } from 'redux';

import { RTCSelf, RTCSelfAction } from '../types';

const initialData = null;

const reducer: Reducer<RTCSelf | null, RTCSelfAction> = (
  state: RTCSelf | null = initialData,
  action: RTCSelfAction
) => {
  switch (action.type) {
    case 'INIT_GAME':
      return action.payload.initialSelf;
    case 'SET_SELF':
      return action.payload;
    case 'SET_STREAM':
      return state
        ? {
            ...state,
            stream: action.payload,
          }
        : state;
    default:
      return state;
  }
};

export const setSelf = (peer: RTCSelf): RTCSelfAction => {
  return {
    type: 'SET_SELF',
    payload: peer,
  };
};

export const setStream = (stream: MediaStream): RTCSelfAction => {
  return {
    type: 'SET_STREAM',
    payload: stream,
  };
};

export default reducer;
