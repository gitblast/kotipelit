import { Reducer } from 'redux';

import { RTCSelf, RTCSelfAction } from '../types';

const initialData = null;

const reducer: Reducer<RTCSelf | null, RTCSelfAction> = (
  state: RTCSelf | null = initialData,
  action: RTCSelfAction
) => {
  switch (action.type) {
    case 'SET_SELF':
      return action.payload;
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

export default reducer;
