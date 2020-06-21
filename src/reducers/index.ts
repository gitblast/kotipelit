import { combineReducers } from 'redux';

import games from './games.reducer';
import user from './user.reducer';

console.log('"user', user);

export default combineReducers({ games, user });
