import { combineReducers } from 'redux';

import games from './games.reducer';
import user from './user.reducer';
import channels from './channels.reducer';
import alert from './alert.reducer';

// rtc
import rtc, { createCustomReducer } from './rtc.reducer';
import { Reducer } from 'react';
import { LocalData, LocalDataAction } from '../types';

// can be used to have a different reducer for different games
export const createReducer = (
  localDataReducer: Reducer<LocalData, LocalDataAction>
) => {
  return combineReducers({
    games,
    user,
    channels,
    alert,
    rtc: createCustomReducer(localDataReducer),
  });
};

export default combineReducers({
  games,
  user,
  channels,
  alert,
  rtc,
});
