import { ThunkAction } from 'redux-thunk';
import userService from '../services/users';

import { Action, User, ActionType, State, LoggedUser } from '../types';

/** @TODO handle errors */

const reducer = (state: User = null, action: Action) => {
  switch (action.type) {
    case ActionType.LOGIN_REQUEST: {
      return {
        username: action.payload,
        loggedIn: false,
      };
    }
    case ActionType.LOGIN_SUCCESS: {
      return {
        ...action.payload,
        loggedIn: true,
      };
    }
    case ActionType.LOGIN_FAILURE: {
      return null;
    }
    case ActionType.LOGOUT: {
      return null;
    }
    default:
      return state;
  }
};

export const logout = (): Action => {
  return { type: ActionType.LOGOUT };
};

export const loginUser = (
  username: string,
  password: string
): ThunkAction<void, State, null, Action> => {
  const request = (username: string): Action => {
    return { type: ActionType.LOGIN_REQUEST, payload: username };
  };

  const success = (user: LoggedUser): Action => {
    return { type: ActionType.LOGIN_SUCCESS, payload: user };
  };

  const failure = (): Action => {
    return { type: ActionType.LOGIN_FAILURE };
  };

  return async (dispatch) => {
    dispatch(request(username));

    try {
      const user = await userService.login(username, password);
      userService.setToken(user.token);
      dispatch(success(user));
    } catch (error) {
      dispatch(failure());
    }
  };
};

export default reducer;
