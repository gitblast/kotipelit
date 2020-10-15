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
      main: 'rgba(66, 10, 38)',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#b1750dd0',
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
