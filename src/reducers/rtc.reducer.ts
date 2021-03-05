import { combineReducers } from 'redux';

import game from './rtcGameSlice';
import self from './rtcSelfSlice';
import kotitonniLocalData from './kotitonni.local.reducer';

import { Reducer } from 'react';
import { LocalData, LocalDataAction } from '../types';

const combinedReducer = {
  self,
  game,
  localData: kotitonniLocalData, // use kotitonni as default
};

// can be used to have a different reducer for different games
export const createCustomReducer = (
  localDataReducer: Reducer<LocalData, LocalDataAction>
) => {
  return combineReducers({ ...combinedReducer, localData: localDataReducer });
};

export default combineReducers(combinedReducer);
