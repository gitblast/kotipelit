/* import { createSlice } from '@reduxjs/toolkit';

const rtcGameSlice = createSlice({
  name: 'game',
  initialState: null,
  reducers: {
    setGame: (state, action) => {
      state = action.payload;
    },
  },
});

export const { setGame } = rtcGameSlice.actions;

export default rtcGameSlice.reducer;
 */

const reducer = (
  state: unknown = null,
  action: { type: string; payload: unknown }
) => {
  switch (action.type) {
    case 'SET_GAME':
      return action.payload;
    default:
      return state;
  }
};

export const setGame = (game: unknown) => {
  return {
    type: 'SET_GAME',
    payload: game,
  };
};

export default reducer;
