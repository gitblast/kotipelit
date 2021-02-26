import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import store from './store';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import App from './App';

// import Axaxax from './assets/fonts/axaxax-bd.ttf';

// const axaxax = {
//   fontFamily: 'Axaxax',
//   // fontStyle: 'semi-bold',
//   // fontDisplay: 'swap',
//   // fontWeight: '600',
//   src: `
//    local('Axaxax'),
//    url(${Axaxax}) format('ttf')
//  `,
//   unicodeRange:
//     'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
// };

const theme = createMuiTheme({
  palette: {
    primary: {
      light: 'rgb(168 164 136)',
      main: 'rgb(170 161 85)',
      dark: 'rgb(103 93 13)',
      contrastText: 'rgba(214, 214, 214)',
    },
    secondary: {
      light: 'rgba(179,69,49)',
      main: 'rgb(133 23 139)',
      dark: 'rgba(81 38 99)',
      contrastText: 'rgba(214, 214, 214)',
    },
    error: {
      main: 'rgba(227, 23, 10)',
    },
  },
  typography: {
    fontFamily: 'Axaxax',
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.8rem',
    },
    h1: {
      fontSize: '2.2rem',
    },
    h2: {
      fontSize: '1.8rem',
    },
    h3: {
      fontSize: '1.6rem',
    },
    h4: {
      fontSize: '1.3rem',
    },
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
    // Used to display links
    caption: {
      wordBreak: 'break-word',
      fontStyle: 'italic',
      fontSize: '0.8rem',
      color: 'rgb(133 23 139)',
    },
  },
  overrides: {
    MuiStepLabel: {
      root: {
        color: 'pink',
      },
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
