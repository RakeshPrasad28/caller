import { combineReducers } from 'redux';
import syncDataReducer from './syncDataSlice';

const rootReducer = combineReducers({
  syncData: syncDataReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
