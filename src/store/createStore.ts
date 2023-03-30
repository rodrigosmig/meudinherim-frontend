 import { combineReducers, configureStore, PreloadedState } from "@reduxjs/toolkit";
import { RootState } from "../hooks/useSelector";
import accountsBalanceSlice from "./slices/accountsSlice";
import applicationSlice from "./slices/applicationSlice";
import authSlice from "./slices/authSlice";
import categoriesSlice from "./slices/categoriesSlice";
import invoicesSlice from "./slices/invoicesSlice";
import notificationSlice from "./slices/notificationSlice";

export const reducer = combineReducers({
  application: applicationSlice,
  notifications: notificationSlice,
  auth: authSlice,
  categories: categoriesSlice,
  accountsBalance: accountsBalanceSlice,
  invoices: invoicesSlice
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