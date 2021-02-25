import { Reducer } from 'redux';

import { KotitonniLocalData, KotitonniLocalAction } from '../types';

const initialData = {
  clickedMap: {},
  timer: 60,
  mutedMap: {},
  videoDisabledMap: {},
};

const reducer: Reducer<KotitonniLocalData, KotitonniLocalAction> = (
  state: KotitonniLocalData = initialData,
  action: KotitonniLocalAction
) => {
  switch (action.type) {
    case 'SET_CLICK':
      return {
        ...state,
        clickedMap: {
          ...state.clickedMap,
          [action.payload.playerId]: action.payload.clicked,
        },
      };
    case 'SET_TIMER':
      return {
        ...state,
        timer: action.payload,
      };
    case 'SET_MUTED':
      return {
        ...state,
        mutedMap: {
          ...state.mutedMap,
          [action.payload.playerId]: action.payload.muted,
        },
      };
    case 'SET_VIDEO_DISABLED': {
      return {
        ...state,
        videoDisabledMap: {
          ...state.videoDisabledMap,
          [action.payload.playerId]: action.payload.disabled,
        },
      };
    }
    case 'RESET': // persist muted map
      return {
        ...state,
        clickedMap: {},
        timer: 60,
      };
    default:
      return state;
  }
};

export const setClicked = (
  playerId: string,
  clicked: boolean
): KotitonniLocalAction => {
  return {
    type: 'SET_CLICK',
    payload: {
      playerId,
      clicked,
    },
  };
};

export const reset = (): KotitonniLocalAction => {
  return { type: 'RESET' };
};

export const setTimer = (value: number): KotitonniLocalAction => {
  return {
    type: 'SET_TIMER',
    payload: value,
  };
};

export const setMuted = (
  playerId: string,
  muted: boolean
): KotitonniLocalAction => {
  return {
    type: 'SET_MUTED',
    payload: {
      playerId,
      muted,
    },
  };
};

export const setVideoDisabled = (
  playerId: string,
  disabled: boolean
): KotitonniLocalAction => {
  return {
    type: 'SET_VIDEO_DISABLED',
    payload: {
      playerId,
      disabled,
    },
  };
};

export default reducer;
