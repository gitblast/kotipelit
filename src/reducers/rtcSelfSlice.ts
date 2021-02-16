import { createSlice } from '@reduxjs/toolkit';

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
