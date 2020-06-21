import { Action, User, ActionType } from '../types';

/** @TODO */
const reducer = (state: User = null, action: Action) => {
  switch (action.type) {
    case ActionType.LOGIN_REQUEST: {
      return null;
    }
    case ActionType.LOGIN_SUCCESS: {
      return null;
    }
    case ActionType.LOGIN_FAILURE: {
      return null;
    }
    case ActionType.LOGOUT: {
      return null;
    }
    default:
      return null;
  }
};

export default reducer;
