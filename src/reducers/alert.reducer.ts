import { Action, ActionType, AlertState } from '../types';
import { Reducer } from 'redux';

const initialState: AlertState = null;

const reducer: Reducer<AlertState, Action> = (
  state: AlertState = initialState,
  action: Action
) => {
  switch (action.type) {
    case ActionType.SET_ERROR:
      return action.payload;
    case ActionType.CLEAR_ERROR:
      return null;
    default:
      return state;
  }
};

export const setError = (alert: string): Action => ({
  type: ActionType.SET_ERROR,
  payload: alert,
});

export const clearError = (): Action => ({
  type: ActionType.CLEAR_ERROR,
});

export default reducer;
