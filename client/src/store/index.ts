import { Store, Reducer } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer, { createReducer } from '../reducers/';

const store = configureStore({
  reducer: rootReducer,
});

export const injectLocalDataReducer = (reducer: Reducer) => {
  const typedStore: Store = store;
  typedStore.replaceReducer(createReducer(reducer));
};

export default store;
