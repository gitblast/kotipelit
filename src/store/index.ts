// redux

import { createStore, applyMiddleware, Store } from 'redux';
import thunk from 'redux-thunk';
import rootReducer, { createReducer } from '../reducers/';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Reducer } from 'react';
import { LocalData, LocalDataAction } from '../types';

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export const injectLocalDataReducer = (
  reducer: Reducer<LocalData, LocalDataAction>
) => {
  const typedStore: Store = store;
  typedStore.replaceReducer(createReducer(reducer));
};

export default store;
