import reducer, {
  setLocalData,
  setClicked,
  resetClicks,
} from './localData.reducer';

import { LocalDataAction, LocalData, GameType } from '../types';

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

  describe('kotitonni', () => {
    it('setClicked should update clicked map', () => {
      const mockState = {
        rtc: {
          localData: {
            gameType: GameType.KOTITONNI,
            clickedMap: {
              testUser: true,
            },
          },
        },
      };

      const expectedAction = {
        type: 'SET_DATA',
        payload: {
          gameType: GameType.KOTITONNI,
          clickedMap: {
            ...mockState.rtc.localData.clickedMap,
            newUser: false,
          },
        },
      };

      const dispatch = jest.fn();
      const getState = jest.fn().mockImplementation(() => mockState);

      setClicked('newUser', false)(dispatch, getState);

      expect(getState).toHaveBeenCalledTimes(1);

      expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });

    it('setClicked should work even if clicked map doesnt exist', () => {
      const mockState = {
        rtc: {
          localData: null,
        },
      };

      const expectedAction = {
        type: 'SET_DATA',
        payload: {
          gameType: GameType.KOTITONNI,
          clickedMap: {
            newUser: false,
          },
        },
      };

      const dispatch = jest.fn();
      const getState = jest.fn().mockImplementation(() => mockState);

      setClicked('newUser', false)(dispatch, getState);

      expect(getState).toHaveBeenCalledTimes(1);

      expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });

    it('should reset click with resetClicks', () => {
      const dispatch = jest.fn();

      resetClicks()(dispatch);

      const expectedData = {
        type: 'SET_DATA',
        payload: {
          gameType: GameType.KOTITONNI,
          clickedMap: {},
        },
      };

      expect(dispatch).toHaveBeenCalledWith(expectedData);
    });
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
