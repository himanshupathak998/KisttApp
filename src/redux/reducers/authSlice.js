import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {apiHeaderKey, apiKey, baseLoanURL, vKYCUrl} from '../../utils/baseUrl';
import apiClientNoJwtHeaders from '../../utils/baseUrl';
import apiClient from '../../utils/interceptor';
 
export const generateOtp = createAsyncThunk(
  'generateOtp',
  async (data, thunkApi) => {
    try {
      thunkApi.dispatch(showLoader());
      const res = await apiClientNoJwtHeaders.post(`/send-otp`, data);
 
      if (res.data.status === 200) {
        // thunkApi.dispatch(hideLoader());
        // toastShow(res.data.message, 'lightgreen');
      } else {
        // thunkApi.dispatch(hideLoader());
        // toastShow(res.data.message, 'red');
      }
    } catch (err) {
      thunkApi.dispatch(hideLoader());
    }
  },
);
export const validatePan = createAsyncThunk(
  'validatePan',
  async (data, thunkApi) => {
    try {
      thunkApi.dispatch(showLoader());
      const headers = {
        'X-Request-ID': 'COR',
 
        'x-api-key': apiHeaderKey,
      };
      const res = await apiClient.post('/PanCardVerification', data, {headers});
 
      if (res.data.status === 200) {
        // thunkApi.dispatch(hideLoader());
        // toastShow(res.data.message, 'lightgreen');
      } else {
        // thunkApi.dispatch(hideLoader());
        // toastShow(res.data.message, 'red');
      }
    } catch (err) {
      thunkApi.dispatch(hideLoader());
    }
  },
);
export const saveAddress = createAsyncThunk(
  'saveAddress',
  async (data, thunkApi) => {
    try {
      thunkApi.dispatch(showLoader());
      const headers = {
        'x-api-key': apiHeaderKey,
      };
      const res = await apiClient.post('/saveAddress', data, {headers});
      if (res.data.status === 200) {
        // thunkApi.dispatch(hideLoader());
        // toastShow(res.data.message, 'lightgreen');
      } else {
        // thunkApi.dispatch(hideLoader());
        // toastShow(res.data.message, 'red');
      }
    } catch (err) {
      thunkApi.dispatch(hideLoader());
    }
  },
);
 
export const updateVkycDB = createAsyncThunk(
  'updateVkycDB',
  async (data, thunkApi) => {
    try {
      thunkApi.dispatch(showLoader());
      const res = await apiClient.post('/save/vkycTrackingId', data);
 
      if (res.data.status === 200) {
        return res;
      } else {
        return res.data;
      }
    } catch (err) {
      thunkApi.dispatch(hideLoader());
    }
  },
);
export const WhatsappApi = createAsyncThunk(
  'WhatsappApi',
  async (data, thunkApi) => {
    try {
      thunkApi.dispatch(showLoader());
 
      // const headers = {
      //   'Content-Type': 'application/json',
      //   accept: 'application/json',
      //   api_key: 'kyqak5muymxcrjhc5q57vz9v',
      // };
 
      const res = await apiClientNoJwtHeaders.post(`/whatsappApi`, data);
 
      if (res.data.status === 200) {
        thunkApi.dispatch(hideLoader());
        // toastShow(res.data.message, 'lightgreen');
      } else {
        thunkApi.dispatch(hideLoader());
        // toastShow(res.data.message, 'red');
      }
    } catch (err) {
      thunkApi.dispatch(hideLoader());
    }
  },
);
export const MoneyTransferImps = createAsyncThunk(
  'MoneyTransferImps',
  async (data, thunkApi) => {
    try {
      thunkApi.dispatch(showLoader());
 
      const headers = {
        'Content-Type': 'application/json',
        'X-Request-ID': 'INS',
        'X-Correlation-ID': '00000000-0000-0000-0001-1616481323987',
        'x-api-key': apiHeaderKey,
      };
 
      const res = await apiClient.put(`/moneyTransferIMPS`, data, {headers});
 
      if (res.data.status === 200) {
        return res;
        // thunkApi.dispatch(hideLoader());
        // toastShow(res.data.message, 'lightgreen');
      } else {
        // thunkApi.dispatch(hideLoader());
        // toastShow(res.data.message, 'red');
      }
    } catch (err) {
      thunkApi.dispatch(hideLoader());
    }
  },
);
export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    curretUser: null,
    authToken: null,
    loader: false,
    forgotPasswordFlag: false,
    loadingText: '',
    userPost: null,
    searchData: {
      content: [],
      page: 1, // Initial page
    },
    searchDetails: [],
    neroMags: null,
    notification: null,
    allPost: null,
    allComment: null,
    createPost: null,
    invate: null,
    getPostId: null,
    getMagzId: null,
    likedPosts: [],
    savedPosts: [],
    followStatus: false,
    likedComments: {},
    getTags: null,
    dashboardAllPost: null,
    getCountry: null,
    magz: null,
    userFollowing: null,
    otherProfile: null,
    postSaveStatus: [],
    posts: [],
    userFollowing: {},
    getSubCategory: null,
    usernameFollowers: null,
    home: {
      content: [],
      loading: false,
      page: 1, // Initial page
    },
    postDetails: [],
    homeDetails: {
      content: [],
      loading: false,
      page: 1, // Initial page
    },
    // homeDetails: null,
    userAllPost: null,
    galleryPost: {
      content: [],
      loading: false,
      page: 1, // Initial page
    },
    createdChat: null,
    getAllMessage: null,
    getChatList: null,
    getNestedComment: null,
  },
 
  reducers: {
    showLoader: (state, action) => {
      state.loader = true;
      state.loadingText = action.payload;
    },
 
    hideLoader: (state, action) => {
      state.loader = false;
    },
    setForgotPasswordFlag: (state, action) => {
      state.forgotPasswordFlag = action.payload;
    },
 
    updateLikedPostStatus: (state, action) => {
      const {postId, isLiked} = action.payload;
 
      if (isLiked) {
        state.likedPosts.push(postId); // Add the post ID to the liked list
      } else {
        state.likedPosts = state.likedPosts.filter(id => id !== postId); // Remove the post ID from the liked list
      }
    },
 
    updateSavedPostStatus: (state, action) => {
      const {postId, isSaved} = action.payload;
 
      if (isSaved) {
        state.savedPosts.push(postId); // Add the post ID to the liked list
      } else {
        state.savedPosts = state.savedPosts.filter(id => id !== postId); // Remove the post ID from the liked list
      }
    },
 
    putSavePost: (state, action) => {
      const {postId} = action.payload;
      return {
        ...state,
        postSaveStatus: [...state.postSaveStatus, {postId, isSaved: true}],
      };
    },
    putUnsavePost: (state, action) => {
      const {postId} = action.payload;
      return {
        ...state,
        postSaveStatus: state.postSaveStatus.filter(
          item => item.postId !== postId,
        ),
      };
    },
 
    updateFollowStatus(state, action) {
      state.followStatus = action.payload;
    },
 
    putLikeCommentUpdate(state, action) {
      const {commentId} = action.payload;
      state.likedComments[commentId] = true;
    },
 
    putUnlikeCommentUpdate(state, action) {
      const {commentId} = action.payload;
      state.likedComments[commentId] = false;
    },
  },
});
 
export const {
  showLoader,
  hideLoader,
  updateLikedPostStatus,
  updateSavedPostStatus,
  updateFollowStatus,
  updateLikedCommentStatus,
  putLikeCommentUpdate,
  putUnlikeCommentUpdate,
  setForgotPasswordFlag,
} = authSlice.actions;
 
export default authSlice.reducer;