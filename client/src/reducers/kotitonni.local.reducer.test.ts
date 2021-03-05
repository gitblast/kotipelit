import reducer, {
  setClicked,
  reset,
  setTimer,
  setMuted,
} from './kotitonni.local.reducer';

import { KotitonniLocalAction } from '../types';

describe('kotitonni local reducer', () => {
  it('should return initial state', () => {
    const expectedState = {
      clickedMap: {},
      timer: 60,
      mutedMap: {},
      videoDisabledMap: {},
    };

    expect(reducer(undefined, {} as KotitonniLocalAction)).toEqual(
      expectedState
    );
  });

  it('should handle SET_CLICK', () => {
    const action: KotitonniLocalAction = {
      type: 'SET_CLICK',
      payload: {
        playerId: 'testID',
        clicked: true,
      },
    };

    const expectedState = {
      clickedMap: {
        testID: true,
      },
      timer: 60,
      mutedMap: {},
      videoDisabledMap: {},
    };

    expect(reducer(undefined, action)).toEqual(expectedState);

    const falsifyingAction: KotitonniLocalAction = {
      type: 'SET_CLICK',
      payload: {
        playerId: 'testID',
        clicked: false,
      },
    };

    const newState = {
      clickedMap: {
        testID: false,
      },
      timer: 60,
      mutedMap: {},
      videoDisabledMap: {},
    };

    expect(reducer(undefined, falsifyingAction)).toEqual(newState);
  });

  it('should handle SET_MUTED', () => {
    const action: KotitonniLocalAction = {
      type: 'SET_MUTED',
      payload: {
        playerId: 'testID',
        muted: true,
      },
    };

    const expectedState = {
      clickedMap: {},
      timer: 60,
      mutedMap: {
        testID: true,
      },
      videoDisabledMap: {},
    };

    expect(reducer(undefined, action)).toEqual(expectedState);

    const falsifyingAction: KotitonniLocalAction = {
      type: 'SET_MUTED',
      payload: {
        playerId: 'testID',
        muted: false,
      },
    };

    const newState = {
      clickedMap: {},
      timer: 60,
      mutedMap: {
        testID: false,
      },
      videoDisabledMap: {},
    };

    expect(reducer(undefined, falsifyingAction)).toEqual(newState);
  });

  it('should handle SET_TIMER', () => {
    const action: KotitonniLocalAction = {
      type: 'SET_TIMER',
      payload: 555,
    };

    const expectedState = {
      clickedMap: {},
      timer: 555,
      mutedMap: {},
      videoDisabledMap: {},
    };

    expect(reducer(undefined, action)).toEqual(expectedState);
  });

  it('should handle RESET', () => {
    const action: KotitonniLocalAction = {
      type: 'RESET',
    };

    const timerAction: KotitonniLocalAction = {
      type: 'SET_TIMER',
      payload: 555,
    };

    const clickAction: KotitonniLocalAction = {
      type: 'SET_CLICK',
      payload: {
        playerId: 'testID',
        clicked: true,
      },
    };

    const muteAction: KotitonniLocalAction = {
      type: 'SET_MUTED',
      payload: {
        playerId: 'testID',
        muted: true,
      },
    };

    const mutedState = reducer(undefined, muteAction);
    const timerState = reducer(mutedState, timerAction);
    const clickState = reducer(timerState, clickAction);

    const expectedStateAfterReset = {
      // muted map should persist
      clickedMap: {},
      timer: 60,
      mutedMap: {
        testID: true,
      },
      videoDisabledMap: {},
    };

    expect(timerState).not.toEqual(expectedStateAfterReset);
    expect(clickState).not.toEqual(expectedStateAfterReset);

    expect(reducer(timerState, action)).toEqual(expectedStateAfterReset);
    expect(reducer(clickState, action)).toEqual(expectedStateAfterReset);
    expect(reducer(mutedState, action)).toEqual(expectedStateAfterReset);
  });

  describe('action creators', () => {
    it('should return action for SET_CLICK with setClicked', () => {
      expect(setClicked('testID', true)).toEqual({
        type: 'SET_CLICK',
        payload: {
          playerId: 'testID',
          clicked: true,
        },
      });
    });

    it('should return action for SET_TIMER with setTimer', () => {
      expect(setTimer(555)).toEqual({
        type: 'SET_TIMER',
        payload: 555,
      });
    });

    it('should return action for RESET with reset', () => {
      expect(reset()).toEqual({
        type: 'RESET',
      });
    });

    it('should return action for SET_MUTED with setMuted', () => {
      expect(setMuted('testID', true)).toEqual({
        type: 'SET_MUTED',
        payload: {
          playerId: 'testID',
          muted: true,
        },
      });
    });
  });
});
