import reducer, * as actions from './user.reducer';
import userService from '../services/users';

import { Action, ActionType, LoggedUser } from '../types';

const login: jest.Mock = userService.login as jest.Mock;
const setToken: jest.Mock = userService.setToken as jest.Mock;

jest.mock('../services/users', () => ({
  login: jest.fn(),
  setToken: jest.fn(),
}));

describe('user reducer', () => {
  it('should return initial state null', () => {
    expect(reducer(undefined, {} as Action)).toEqual({
      loggedIn: false,
      jitsiRoom: null,
      socket: null,
      displayName: null,
      loggingIn: false,
    });
  });

  it('should handle LOGIN_REQUEST', () => {
    const action: Action = {
      type: ActionType.LOGIN_REQUEST,
    };

    const expectedState = {
      loggedIn: false,
      loggingIn: true,
      jitsiRoom: null,
      socket: null,
      displayName: null,
    };

    expect(reducer(undefined, action)).toEqual(expectedState);
  });

  it('should handle LOGIN_FAILURE', () => {
    const action: Action = {
      type: ActionType.LOGIN_FAILURE,
    };

    expect(reducer(undefined, action)).toEqual({
      loggedIn: false,
      jitsiRoom: null,
      socket: null,
      displayName: null,
      loggingIn: false,
    });
  });

  it('should handle LOGIN_SUCCESS', () => {
    const user: LoggedUser = {
      username: 'username',
      token: 'token',
      loggedIn: true,
      jitsiToken: null,
      jitsiRoom: null,
      socket: null,
      loggingIn: false,
    };

    const action: Action = {
      type: ActionType.LOGIN_SUCCESS,
      payload: user,
    };

    expect(reducer(undefined, action)).toEqual(user);
  });

  it('should handle LOGOUT', () => {
    const action: Action = {
      type: ActionType.LOGOUT,
    };

    expect(reducer(undefined, action)).toEqual({
      loggedIn: false,
      jitsiRoom: null,
      socket: null,
      displayName: null,
      loggingIn: false,
    });
  });

  it('should handle SET_JITSI_TOKEN', () => {
    const action: Action = {
      type: ActionType.SET_JITSI_TOKEN,
      payload: 'JITSI_TOKEN!',
    };

    expect(reducer(undefined, action)).toEqual({
      loggedIn: false,
      jitsiToken: 'JITSI_TOKEN!',
      jitsiRoom: null,
      socket: null,
      displayName: null,
      loggingIn: false,
    });
  });

  it('should handle SET_DISPLAYNAME', () => {
    const action: Action = {
      type: ActionType.SET_DISPLAYNAME,
      payload: 'DISPLAYNAME',
    };

    expect(reducer(undefined, action)).toEqual({
      loggedIn: false,
      jitsiRoom: null,
      socket: null,
      displayName: 'DISPLAYNAME',
      loggingIn: false,
    });
  });

  describe('checkForUser -function', () => {
    it('should set token and dispatch login success if saved user found in localStorage', () => {
      const user = {
        username: 'username',
        token: 'tokenFromStorage',
        jitsiToken: null,
        jitsiRoom: null,
        socket: null,
        loggingIn: false,
      };

      window.localStorage.setItem('kotipelitUser', JSON.stringify(user));

      const dispatch = jest.fn();
      actions.checkForUser()(dispatch);
      expect(dispatch).toHaveBeenCalledWith(actions.loginSuccess(user));
      expect(setToken).toHaveBeenLastCalledWith('tokenFromStorage');
    });

    it('should do nothing if user not found in localStorage', () => {
      window.localStorage.removeItem('kotipelitUser');
      expect(window.localStorage.getItem('kotipelitUser')).toBe(null);
      const dispatch = jest.fn();
      actions.checkForUser()(dispatch);
      expect(dispatch).not.toHaveBeenCalled();
      expect(window.localStorage.getItem('kotipelitUser')).toBe(null);
    });
  });

  describe('async login & logout', () => {
    it('should dispatch login request', async () => {
      const dispatch = jest.fn();
      await actions.loginUser('username', 'password')(dispatch);
      expect(dispatch).toHaveBeenCalledWith(actions.loginRequest());
    });

    it('should clear localStorage and dispatch logout on logout', () => {
      window.localStorage.setItem('kotipelitUser', 'mock-user');
      expect(window.localStorage.getItem('kotipelitUser')).toBe('mock-user');

      const expectedAction: Action = {
        type: ActionType.LOGOUT,
      };

      const action: Action = actions.logout();
      expect(window.localStorage.getItem('kotipelitUser')).toBe(null);
      expect(action).toEqual(expectedAction);
    });

    describe('when login succeeds', () => {
      const returnedUser = {
        username: 'username',
        token: 'token',
        jitsiToken: null,
      };

      beforeEach(() => login.mockResolvedValue(returnedUser));

      it('should dispatch success with received object', async () => {
        const dispatch = jest.fn();
        await actions.loginUser('username', 'password')(dispatch);
        expect(dispatch).toHaveBeenLastCalledWith(
          actions.loginSuccess(returnedUser)
        );
      });

      it('should set token to userService', async () => {
        const dispatch = jest.fn();
        login.mockResolvedValueOnce({
          username: 'username',
          token: 'specialToken',
        });
        await actions.loginUser('username', 'password')(dispatch);
        expect(setToken).toHaveBeenLastCalledWith('specialToken');
      });

      it('should set recieved user in localStorage as kotipelitUser', async () => {
        window.localStorage.removeItem('kotipelitUser');
        expect(window.localStorage.getItem('kotipelitUser')).toBe(null);
        const dispatch = jest.fn();
        await actions.loginUser('username', 'password')(dispatch);
        expect(window.localStorage.getItem('kotipelitUser')).toBe(
          JSON.stringify(returnedUser)
        );
      });
    });

    describe('when login fails', () => {
      const error = new Error('error!');

      beforeEach(() => login.mockRejectedValue(error));

      it('should dispatch failure', async () => {
        const dispatch = jest.fn();
        await actions.loginUser('username', 'password')(dispatch);
        expect(dispatch).toHaveBeenLastCalledWith(actions.loginFailure());
      });
    });
  });
});
