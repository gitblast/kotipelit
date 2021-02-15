import { combineReducers } from 'redux';

import activeGame from './activeGameSlice';
import self from './rtcSelf.reducer';
import { Reducer } from 'react';
import { LocalData, LocalDataAction } from '../types';

const combinedReducer = {
  self,
  activeGame,
};

// can be used to have a different reducer for different games
export const createCustomReducer = (
  localDataReducer: Reducer<LocalData, LocalDataAction>
) => {
  return combineReducers({ ...combinedReducer, localData: localDataReducer });
};

export default combineReducers({ ...combinedReducer });
