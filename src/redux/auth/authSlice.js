import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    errorCode: null,
    error: null,
    isLoading: false,
    isLoggedIn: false,
    isRegistered: false,
    user: null,
  },

  reducers: {
    authActionStart: (state) => {
      state.isLoading = true;
      state.error = null;
      state.errorCode = null;
    },
    authActionFailure: (state, action) => {
      state.isLoading = false;
      state.isLoggedIn = false;
      state.error = action.payload.detail;
      state.errorCode = action.payload.errorCode;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.isLoggedIn = true;
      state.user = action.payload;
      state.error = null;
      state.errorCode = null;
    },
    registerSuccess: (state, action) => {
      state.isLoading = false;
      state.isRegistered = true;
      state.error = null;
      state.errorCode = null;
    },
    resetAuthState: (state) => {
      state.isLoading = false;
      state.isLoggedIn = false;
      state.isRegistered = false;
      state.user = null;
      state.error = null;
      state.errorCode = null;
    },
    setAuthState: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  setAuthState,
  authActionStart,
  loginSuccess,
  authActionFailure,
  registerSuccess,
  resetAuthState,
} = authSlice.actions;

export default authSlice.reducer;
