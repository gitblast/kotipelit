import { Store } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer, { createReducer } from '../reducers/';
import { Reducer } from 'react';
import { LocalData, LocalDataAction } from '../types';

const store = configureStore({
  reducer: rootReducer,
});

export const injectLocalDataReducer = (
  reducer: Reducer<LocalData, LocalDataAction>
) => {
  const typedStore: Store = store;
  typedStore.replaceReducer(createReducer(reducer));
};

export default store;
