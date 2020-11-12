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
      main: 'rgba(33, 99, 146)',
      contrastText: 'rgba(218, 214, 214)',
    },
    secondary: {
      light: 'rgba(179,69,49)',
      main: 'rgba(179,49,49)',
      dark: 'rgba(129,29,29)',
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
