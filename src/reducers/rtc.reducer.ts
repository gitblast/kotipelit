import { combineReducers } from 'redux';

import game from './rtcGame.reducer';
import localData from './localData.reducer';
import self from './rtcSelf.reducer';

export default combineReducers({ game, localData, self });
