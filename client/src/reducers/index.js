import { combineReducers } from 'redux';

// reducers
import auth from './auth';
import alert from './alert';
import profile from './profile';

export default combineReducers({
  alert,
  auth,
  profile
});