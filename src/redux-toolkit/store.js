import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "./reducers/loginReducer";
import parentSlice from "./reducers/parentReducer";
import staffSlice from "./reducers/staffReducer"
import scanSlice from "./reducers/scanReducer"
import passwordSlice from "./reducers/passwordReducer"

const store = configureStore({
  reducer: {
    loginSlice,
    parentSlice,
    staffSlice,
    scanSlice,
    passwordSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

export default store;
