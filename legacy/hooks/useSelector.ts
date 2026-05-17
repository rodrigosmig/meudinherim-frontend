import { 
  TypedUseSelectorHook,
  useSelector as useReduxSelector,
} from "react-redux";
import { reducer } from "../store/createStore";


export type RootState = ReturnType<typeof reducer>;
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;