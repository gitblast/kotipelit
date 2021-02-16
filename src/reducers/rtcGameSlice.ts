import { createSlice } from '@reduxjs/toolkit';

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
