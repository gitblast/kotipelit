import React from 'react';
import ReactDOM from 'react-dom';

// redux
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer from './reducer/reducer';

import App from './App';

const store = createStore(reducer, composeWithDevTools());

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
