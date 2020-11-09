import { combineReducers } from 'redux';

import game from './rtcGame.reducer';
import self from './rtcSelf.reducer';
import peers from './rtcPeers.reducer';
import { Reducer } from 'react';
import { LocalData, LocalDataAction } from '../types';

const combinedReducer = {
  game,
  self,
  peers,
};

// can be used to have a different reducer for different games
export const createCustomReducer = (
  localDataReducer: Reducer<LocalData, LocalDataAction>
) => {
  return combineReducers({ ...combinedReducer, localData: localDataReducer });
};

export default combineReducers({ ...combinedReducer });
