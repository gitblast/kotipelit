import reducer, { setLocalData } from './localData.reducer';

import { LocalDataAction, LocalData } from '../types';

describe('local data reducer', () => {
  it('should return initial state null', () => {
    expect(reducer(undefined, {} as LocalDataAction)).toBeNull();
  });

  it('should handle SET_DATA', () => {
    const action: LocalDataAction = {
      type: 'SET_DATA',
      payload: {} as LocalData,
    };

    const expectedState = action.payload;

    expect(reducer(undefined, action)).toEqual(expectedState);
  });

  describe('action creators', () => {
    it('should return an action for SET_DATA with setLocalData', () => {
      const data = {} as LocalData;

      const expectedAction: LocalDataAction = {
        type: 'SET_DATA',
        payload: data,
      };

      expect(setLocalData(data)).toEqual(expectedAction);
    });
  });
});
