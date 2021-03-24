import { combineReducers, Reducer } from 'redux';

import game from './rtcGameSlice';
import self from './rtcSelfSlice';

const combinedReducer = {
  self,
  game,
};

// can be used to have a different reducer for different games
export const createCustomReducer = (localDataReducer: Reducer) => {
  return combineReducers({ ...combinedReducer, localData: localDataReducer });
};

export default combineReducers(combinedReducer);
