import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";

// reducers
import authReducer from "./auth/authSlice";

const rootReducer = combineReducers({
  auth: authReducer,
});

// export const store = configureStore({
//   reducer: rootReducer,
// });

// create a makeStore function
const makeStore = () =>
  configureStore({
    reducer: rootReducer,
    devTools: true,
  });

// export an assembled wrapper
export const wrapper = createWrapper(makeStore);
