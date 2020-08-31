import React from 'react';
import { render } from '@testing-library/react';

import App from './App';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers/';

const store = createStore(reducer);

/** @TODO handle async */

it.skip('renders kotipelit.com link', () => {
  const { getByText } = render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  const homeLink = getByText(/kotipelit.com/i);
  expect(homeLink).toBeInTheDocument();
});
