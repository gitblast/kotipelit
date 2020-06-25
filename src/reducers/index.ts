import { combineReducers } from 'redux';

import games from './games.reducer';
import user from './user.reducer';
import channels from './channels.reducer';

export default combineReducers({ games, user, channels });
