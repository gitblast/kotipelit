import { combineReducers } from 'redux';

import games from './games.reducer';
import channels from './channels.reducer';
import alert from './alert.reducer';

export default combineReducers({
  games,
  channels,
  alert,
});
