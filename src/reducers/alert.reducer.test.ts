import reducer from './alert.reducer';
import { Action, AlertState, ActionType } from '../types';

describe('alert reducer', () => {
  it('should return initial state null', () => {
    expect(reducer(undefined, {} as Action)).toEqual(null);
  });

  it('should handle set error and clear error', () => {
    const action: Action = {
      type: ActionType.SET_ERROR,
      payload: 'alert',
    };

    const expectedState: AlertState = 'alert';

    expect(reducer(undefined, action)).toEqual(expectedState);

    const clearAction: Action = {
      type: ActionType.CLEAR_ERROR,
    };

    expect(reducer(undefined, clearAction)).toEqual(null);
  });
});
