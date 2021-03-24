import { combineReducers, Reducer } from 'redux';

import games from './games.reducer';
import user from './user.reducer';
import channels from './channels.reducer';
import alert from './alert.reducer';

// rtc
import rtc, { createCustomReducer } from './rtc.reducer';

// can be used to have a different reducer for different games
export const createReducer = (localDataReducer: Reducer) => {
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
