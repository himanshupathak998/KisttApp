import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import api from './../../utils/baseUrl';

export const loginUser = createAsyncThunk('login', async data => {
  try {
    const res = await api.post('user/login', data);
    if (res.status === 200) {
      await authStorage.storeToken(res.data.accessToken);
      return res.data.accessToken;
    } else {
      toastShow('Invalid username and password');
    }
  } catch (err) {
    console.log('error--------->>', err);
  }
});






export const postSlice = createSlice({
  name: 'post',
  initialState: {
    curretUser: null,
    authToken: null,
    loader: false,
    loadingText: '',
    userPost: null,
    searchData:null,
    neroMags:null
    //   navWidth: false,
    //   sideNavVisible: false,

    // data: null,
  },

  reducers: {
    showLoader: (state, action) => {
      state.loader = true;
      state.loadingText = action.payload;
    },
    hideLoader: (state, action) => {
      state.loader = false;
    },

    //   navWidths: (state, action) => {
    //     state.navWidth = action.payload;
    //   },
    //   sideNavVisibles: (state, action) => {
    //     state.sideNavVisible = action.payload;
    //   },
  },
  extraReducers: builder => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.authToken = action.payload;
    });
  
  },
});

export const {showLoader, hideLoader} = postSlice.actions;

export default postSlice.reducer;
