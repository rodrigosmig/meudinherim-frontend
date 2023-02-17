 import { combineReducers, configureStore, PreloadedState } from "@reduxjs/toolkit";
import { RootState } from "../hooks/useSelector";
import authSlice from "./slices/authSlice";
import categoriesSlice from "./slices/categoriesSlice";

export const reducer = combineReducers({
  auth: authSlice,
  categories: categoriesSlice
});

export function setupStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    reducer,
    preloadedState,
    middleware: getDefaultMiddleware => 
      getDefaultMiddleware({serializableCheck: false})
  })
}

export type AppStore = ReturnType<typeof setupStore>
export default setupStore();