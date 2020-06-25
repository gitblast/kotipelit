import reducer from './user.reducer';
import { Action, ActionType } from '../types';

describe('games reducer', () => {
  it('should return initial state null', () => {
    expect(reducer(undefined, {} as Action)).toEqual(null);
  });

  it('should handle LOGIN_REQUEST', () => {
    const action: Action = {
      type: ActionType.LOGIN_REQUEST,
      payload: 'username',
    };

    const expectedState = {
      username: 'username',
      loggingIn: true,
    };

    expect(reducer(undefined, action)).toEqual(expectedState);
  });

  it('should handle LOGIN_FAILURE', () => {
    const action: Action = {
      type: ActionType.LOGIN_FAILURE,
    };

    expect(reducer(undefined, action)).toEqual(null);
  });

  it('should handle LOGIN_SUCCESS', () => {
    const user = {
      username: 'username',
      token: 'token',
    };

    const action: Action = {
      type: ActionType.LOGIN_SUCCESS,
      payload: user,
    };

    expect(reducer(undefined, action)).toEqual(user);
  });
});
