import { combineReducers } from 'redux';
import userReducer from './userReducer';
import authReducer from './authReducer'; // Other reducers you have

const rootReducer = combineReducers({
  user: userReducer,
  auth: authReducer,
  // add other reducers here
});

export default rootReducer;