import { Reducer } from 'redux';

import { LocalData, LocalDataAction } from '../types';

const initialData = null;

const reducer: Reducer<LocalData, LocalDataAction> = (
  state: LocalData = initialData,
  action: LocalDataAction
) => {
  switch (action.type) {
    case 'SET_DATA':
      return action.payload;
    default:
      return state;
  }
};

export const setLocalData = (data: LocalData): LocalDataAction => {
  return {
    type: 'SET_DATA',
    payload: data,
  };
};

export default reducer;
