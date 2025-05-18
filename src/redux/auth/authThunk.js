import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  setAuthState,
  authActionStart,
  loginSuccess,
  authActionFailure,
  registerSuccess,
} from "./authSlice";
import { authService } from "@/services";
import { clearToken, clearUser, setToken, setUser } from "@/utils/storageUtils";

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      // Dispatching the authActionStart action before the API call
      thunkAPI.dispatch(authActionStart());

      const { token, error, ...user } = await authService.login(credentials);
      console.log(token);
      console.log(user);


      if (user?.result?.id && token) {
        setToken(token);
        setUser(user?.result);
        thunkAPI.dispatch(loginSuccess(user?.result));
      } else {
        throw new Error("Server error!");
      }
    } catch (error) {
      // Dispatching the authActionFailure action with the error as payload
      thunkAPI.dispatch(authActionFailure({ detail: error.message }));
    }
  }
);

export const logout = createAsyncThunk("auth/logout", (_payload, thunkAPI) => {
  // clean token and user info in cookies
  clearToken();
  clearUser();

  // update store
  thunkAPI.dispatch(
    setAuthState({
      isLoggedIn: false,
      user: null,
    })
  );

  // TODO: call logout API once BE implemented logout API to remove the token
});

export const register = createAsyncThunk(
  "auth/register",
  async (credentials, thunkAPI) => {
    try {
      // Dispatching the authActionStart action before the API call
      thunkAPI.dispatch(authActionStart());

      const { success, error } = await authService.register(credentials);

      if (error) {
        thunkAPI.dispatch(authActionFailure(error));
      } else if (success) {
        thunkAPI.dispatch(registerSuccess());
      } else {
        throw new Error("Server error!");
      }
    } catch (error) {
      // Dispatching the authActionFailure action with the error as payload
      thunkAPI.dispatch(authActionFailure({ detail: error.message }));
      throw error;
    }
  }
);