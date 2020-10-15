import { combineReducers } from 'redux';

import game from './rtcGame.reducer';
import localData from './localData.reducer';

export default combineReducers({ game, localData });
