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
      main: '#3d0833',
      dark: '#424242',
      contrastText: 'rgba(214, 214, 214)',
    },
    secondary: {
      light: 'rgba(179,69,49)',
      main: 'rgb(52 75 115)',
      dark: 'rgba(98 2 2)',
      contrastText: 'rgba(214, 214, 214)',
    },
    error: {
      main: 'rgba(227, 23, 10)',
    },
  },
  typography: {
    fontFamily: 'Itim',
    body1: {
      fontSize: '1.2rem',
    },
    body2: {
      color: 'rgb(34 38 39)',
    },
    h4: {},
    h5: {
      fontSize: 26,
    },
    h6: {
      fontFamily: 'Bebas Neue',
      fontSize: 32,
      lineHeight: 1,
    },
    subtitle1: {
      fontFamily: 'Pacifico',
      fontSize: 26,
    },
    // Used to display the game name and host name in GameRoom
    subtitle2: {
      fontFamily: 'Great Vibes',
      fontSize: 60,
      lineHeight: 1,
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
