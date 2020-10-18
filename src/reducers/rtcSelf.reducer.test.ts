import reducer, { setSelf } from './rtcSelf.reducer';

import { RTCSelf, RTCSelfAction } from '../types';

describe('rtc self reducer', () => {
  it('should return initial state null', () => {
    expect(reducer(undefined, {} as RTCSelfAction)).toBeNull();
  });

  it('should handle SET_SELF', () => {
    const action: RTCSelfAction = {
      type: 'SET_SELF',
      payload: {} as RTCSelf,
    };

    const expectedState = action.payload;

    expect(reducer(undefined, action)).toEqual(expectedState);
  });

  describe('action creators', () => {
    it('should return an action for SET_SELF with setSelf', () => {
      const self = {} as RTCSelf;

      const expectedAction: RTCSelfAction = {
        type: 'SET_SELF',
        payload: self,
      };

      expect(setSelf(self)).toEqual(expectedAction);
    });
  });
});
