import { Reducer } from 'redux';

import { RTCGame, RTCGameAction } from '../types';

const initialData = null;

const reducer: Reducer<RTCGame | null, RTCGameAction> = (
  state: RTCGame | null = initialData,
  action: RTCGameAction
) => {
  switch (action.type) {
    case 'SET_GAME':
      return action.payload;
    default:
      return state;
  }
};

export const setGame = (data: RTCGame): RTCGameAction => {
  return {
    type: 'SET_GAME',
    payload: data,
  };
};

export default reducer;
