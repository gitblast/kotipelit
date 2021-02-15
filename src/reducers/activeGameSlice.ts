import { createSlice } from '@reduxjs/toolkit';

const activeGameSlice = createSlice({
  name: 'activeGame',
  initialState: null,
  reducers: {
    setGame: (state, action) => {
      state = action.payload;
    },
  },
});

export const { setGame } = activeGameSlice.actions;

export default activeGameSlice.reducer;
