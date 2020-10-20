import reducer, {
  setLocalData,
  setClicked,
  reset,
  setTimer,
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
            timer: 555,
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
          timer: 555,
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

          timer: 90,
        },
      };

      const dispatch = jest.fn();
      const getState = jest.fn().mockImplementation(() => mockState);

      setClicked('newUser', false)(dispatch, getState);

      expect(getState).toHaveBeenCalledTimes(1);

      expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });

    it('should reset clicks and timer with reset', () => {
      const dispatch = jest.fn();

      reset()(dispatch);

      const expectedData = {
        type: 'SET_DATA',
        payload: {
          gameType: GameType.KOTITONNI,
          clickedMap: {},
          timer: 90,
        },
      };

      expect(dispatch).toHaveBeenCalledWith(expectedData);
    });
  });

  it('should update timer value with setTimer', () => {
    const mockState = {
      rtc: {
        localData: null,
      },
    };

    const dispatch = jest.fn();
    const getState = jest.fn().mockImplementationOnce(() => mockState);

    setTimer(111)(dispatch, getState);

    const expectedData = {
      type: 'SET_DATA',
      payload: {
        gameType: GameType.KOTITONNI,
        clickedMap: {},
        timer: 111,
      },
    };

    expect(getState).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(expectedData);

    const currentState = {
      ...mockState,
      rtc: { localData: expectedData.payload },
    };

    getState.mockImplementationOnce(() => currentState);

    setTimer(222)(dispatch, getState);

    const expectedDataNow = {
      type: 'SET_DATA',
      payload: {
        gameType: GameType.KOTITONNI,
        clickedMap: {},
        timer: 222,
      },
    };

    expect(getState).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenLastCalledWith(expectedDataNow);
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
