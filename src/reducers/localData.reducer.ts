import { Reducer, Dispatch } from 'redux';

import { GameType, LocalData, LocalDataAction, State } from '../types';
import logger from '../utils/logger';

const initialData = null;

const reducer: Reducer<LocalData, LocalDataAction> = (
  state: LocalData = initialData,
  action: LocalDataAction
) => {
  switch (action.type) {
    case 'SET_DATA':
      return action.payload;
    default:
      return state;
  }
};

export const setLocalData = (data: LocalData): LocalDataAction => {
  return {
    type: 'SET_DATA',
    payload: data,
  };
};

// Kotitonni

export const setClicked = (playerId: string, clicked: boolean) => {
  return (dispatch: Dispatch, getState: () => State) => {
    try {
      const oldClickedMap = getState().rtc.localData?.clickedMap;

      const data: LocalData = {
        gameType: GameType.KOTITONNI,
        clickedMap: {
          ...oldClickedMap,
          [playerId]: clicked,
        },
      };

      dispatch(setLocalData(data));
    } catch (e) {
      logger.error('error setting clickmap:', e.message);
    }
  };
};

export const resetClicks = () => {
  return (dispatch: Dispatch) => {
    const data: LocalData = {
      gameType: GameType.KOTITONNI,
      clickedMap: {},
    };

    dispatch(setLocalData(data));
  };
};

export default reducer;
