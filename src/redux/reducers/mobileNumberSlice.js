import { createSlice } from '@reduxjs/toolkit';

const mobileNumberSlice = createSlice({
  name: 'mobileNumber',
  initialState: {
    value: '',
  },
  reducers: {
    setMobileNumber: (state, action) => {
      state.value = action.payload;
    },
    clearMobileNumber: (state) => {
      state.value = '';
    },
  },
});

export const { setMobileNumber, clearMobileNumber } = mobileNumberSlice.actions;

export default mobileNumberSlice.reducer;
