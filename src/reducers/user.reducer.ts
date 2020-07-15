import { Dispatch, Reducer } from 'redux';
import userService from '../services/users';

import { Action, User, ActionType, LoggedUser, BaseUser } from '../types';

/** @TODO handle errors */

const initialUser: BaseUser = {
  loggedIn: false,
  socket: null,
  jitsiRoom: null,
};

const reducer: Reducer<User, Action> = (
  state: User = initialUser,
  action: Action
) => {
  switch (action.type) {
    case ActionType.LOGIN_REQUEST: {
      return {
        ...state,
        username: action.payload,
        loggedIn: false,
      };
    }
    case ActionType.LOGIN_SUCCESS: {
      return {
        ...action.payload,
        loggedIn: true,
        jitsiToken: null,
        socket: null,
        jitsiRoom: null,
      };
    }
    case ActionType.LOGIN_FAILURE: {
      return { loggedIn: false, socket: null, jitsiRoom: null };
    }
    case ActionType.LOGOUT: {
      return { loggedIn: false, socket: null, jitsiRoom: null };
    }
    case ActionType.SET_JITSI_TOKEN: {
      return {
        ...state,
        jitsiToken: action.payload,
      };
    }
    case ActionType.SET_JITSI_ROOM: {
      return {
        ...state,
        jitsiRoom: action.payload,
      };
    }
    case ActionType.SET_SOCKET: {
      return {
        ...state,
        socket: action.payload,
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

export const loginSuccess = (
  user: Pick<LoggedUser, 'username' | 'token'>
): Action => ({
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

      const loggedUser = {
        ...user,
      };

      window.localStorage.setItem('kotipelitUser', JSON.stringify(loggedUser));

      dispatch(loginSuccess(loggedUser));
    } catch (error) {
      dispatch(loginFailure());
    }
  };
};

export const setJitsiToken = (token: string): Action => ({
  type: ActionType.SET_JITSI_TOKEN,
  payload: token,
});

export const setJitsiRoom = (roomName: string): Action => ({
  type: ActionType.SET_JITSI_ROOM,
  payload: roomName,
});

export const setSocket = (socket: SocketIOClient.Socket): Action => ({
  type: ActionType.SET_SOCKET,
  payload: socket,
});

export default reducer;
