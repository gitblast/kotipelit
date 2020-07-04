import { Dispatch } from 'redux';
import userService from '../services/users';

import { Action, User, ActionType, LoggedUser } from '../types';

/** @TODO handle errors */

const reducer = (state: User = { loggedIn: false }, action: Action) => {
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
      return { loggedIn: false };
    }
    case ActionType.LOGOUT: {
      return { loggedIn: false };
    }
    case ActionType.SET_JITSI_TOKEN: {
      return {
        ...state,
        jitsiToken: action.payload,
      };
    }
    default:
      return state;
  }
};

/**
 * Checks for a logged user in localStrorage. If found, sets it as user and sets token for userservice
 */
export const checkForUser = () => {
  return (dispatch: Dispatch) => {
    const loggedUser = window.localStorage.getItem('kotipelitUser');

    if (loggedUser) {
      const parsedUser: LoggedUser = JSON.parse(loggedUser);

      userService.setToken(parsedUser.token);

      dispatch({
        type: ActionType.LOGIN_SUCCESS,
        payload: parsedUser,
      });
    }
  };
};

/**
 * Clears user from localStorage and sets user to null
 */
export const logout = (): Action => {
  window.localStorage.removeItem('kotipelitUser');
  return { type: ActionType.LOGOUT };
};

export const loginRequest = (username: string): Action => ({
  type: ActionType.LOGIN_REQUEST,
  payload: username,
});

export const loginSuccess = (user: Omit<LoggedUser, 'loggedIn'>): Action => ({
  type: ActionType.LOGIN_SUCCESS,
  payload: user,
});

export const loginFailure = (): Action => ({ type: ActionType.LOGIN_FAILURE });

/**
 * Logs in user. If succesful, sets token to userservice and saves user in localStorage.
 * @param username
 * @param password
 */
export const loginUser = (username: string, password: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(loginRequest(username));

    try {
      const user = await userService.login(username, password);
      userService.setToken(user.token);

      window.localStorage.setItem('kotipelitUser', JSON.stringify(user));

      dispatch(loginSuccess({ ...user, jitsiToken: null }));
    } catch (error) {
      dispatch(loginFailure());
    }
  };
};

export const setJitsiToken = (token: string): Action => ({
  type: ActionType.SET_JITSI_TOKEN,
  payload: token,
});

export default reducer;
