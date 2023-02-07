import { useDispatch as useReduxDispatch } from 'react-redux';
import store from '../store/createStore';

export type AppDispatch = typeof store.dispatch;
export const useDispatch = () => useReduxDispatch<AppDispatch>();