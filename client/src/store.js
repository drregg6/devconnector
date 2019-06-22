import { createStore, applyMiddleware } from 'redux';
import { compose } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import rootReducer from './reducers';

const initialState = {};
const middleware = [thunk];

// createStore([reducer], [initialState], [middleware])
const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(appleMiddleware(...middleware))
);

export default store;