import { createSlice } from '@reduxjs/toolkit';
import api from './../../utils/baseUrl';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    userReferenceNumber: '',
    mobileNumber: '',
    pan: '',
    udyamNumber: '',
    name: '',
    address: '',
    pincode: '',
    dateOfBirth: '',
    state: '',
    city: '',
    fatherName: '',
    PhotoUrl: '',
    gender: '',
    email: '',
    adhar: '',
    rate:'',
    maxTenure:'',
    minTenure:'',
    procFees:'',
    eligibleAmount:'',
    selectedTenure:'',
    value:''
  },
  reducers: {
    setUserDetails: (state, action) => {
      state.userReferenceNumber = action.payload.userReferenceNumber;
      state.mobileNumber = action.payload.mobileNumber;
      state.pan = action.payload.pan;
      state.udyamNumber = action.payload.udyamNumber;
      state.name = action.payload.name;
      state.address = action.payload.address;
      state.pincode = action.payload.pincode;
      state.dateOfBirth = action.payload.dateOfBirth;
      state.state = action.payload.state;
      state.city = action.payload.city;
      state.fatherName = action.payload.fatherName;
      state.PhotoUrl = action.payload.PhotoUrl;
      state.gender = action.payload.gender;
      state.email = action.payload.email;
      state.adhar = action.payload.adhar;
      state.rate = action.payload.rate;
      state.maxTenure = action.payload.maxTenure;
      state.minTenure = action.payload.minTenure;
      state.procFees = action.payload.procFees;
      state.eligibleAmount = action.payload.eligibleAmount;
    },
  },
  // selectors: {
  //   selectPan: user => user.pan,
  //   selectUdyamNumber: user => user.udyamNumber,
  // }
});



export const { setUserDetails } = userSlice.actions;
// export const { selectPan, selectUdyamNumber } = userSlice.selectors;
export default userSlice.reducer;
