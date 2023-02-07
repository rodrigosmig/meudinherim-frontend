import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import categoriesSlice from "./slices/categoriesSlice";

export const reducer = combineReducers({
  auth: authSlice,
  categories: categoriesSlice
});

export const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware => 
    getDefaultMiddleware({serializableCheck: false})
});

export default store;