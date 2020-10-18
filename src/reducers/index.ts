import { combineReducers } from 'redux';

import games from './games.reducer';
import user from './user.reducer';
import channels from './channels.reducer';
import alert from './alert.reducer';

// rtc
import rtc from './rtc.reducer';

export default combineReducers({ games, user, channels, alert, rtc });
