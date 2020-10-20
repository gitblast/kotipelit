import { combineReducers } from 'redux';

import game from './rtcGame.reducer';
import self from './rtcSelf.reducer';
import { Reducer } from 'react';
import { LocalData, LocalDataAction } from '../types';

// can be used to have a different reducer for different games
export const createCustomReducer = (
  localDataReducer: Reducer<LocalData, LocalDataAction>
) => {
  return combineReducers({ game, self, localData: localDataReducer });
};

export default combineReducers({ game, self });
