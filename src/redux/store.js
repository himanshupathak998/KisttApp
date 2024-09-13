import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/authSlice";
import postSlice from "./reducers/postSlice";
import userSlice from "./reducers/userSlice";
import mobileNumberSlice from "./reducers/mobileNumberSlice";

const reducer = {
  auth: authSlice,
  post: postSlice,
  user: userSlice,
  mobileNumber: mobileNumberSlice,
};

export default configureStore({
  reducer,
});