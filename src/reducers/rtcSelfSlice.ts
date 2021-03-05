/* import { createSlice } from '@reduxjs/toolkit';

const rtcSelfSlice = createSlice({
  name: 'self',
  initialState: null,
  reducers: {
    setSelf: (state, action) => {
      state = action.payload;
    },
  },
});

export const { setSelf } = rtcSelfSlice.actions;

export default rtcSelfSlice.reducer;
 */

const reducer = (
  state: unknown = null,
  action: { type: string; payload: unknown }
) => {
  switch (action.type) {
    case 'SET_SELF':
      return action.payload;
    default:
      return state;
  }
};

export const setSelf = (game: unknown) => {
  return {
    type: 'SET_SELF',
    payload: game,
  };
};

export default reducer;
