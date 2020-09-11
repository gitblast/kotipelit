import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import store from './store';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import App from './App';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#f1dac2',
      main: '#ca9762',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#6d0126',
    },
  },
  typography: {
    fontFamily: 'Itim',
    h4: {},
    h5: {
      fontSize: 22,
    },
    subtitle1: {
      fontFamily: 'Fascinate Inline',
      fontSize: 18,
    },
  },
});

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </Provider>,
  document.getElementById('root')
);
