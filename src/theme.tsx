import { createMuiTheme } from '@material-ui/core/styles';

// import Zrnic from '.assets/fonts/zrnic-rg.ttf';

// const zrnic = {
//   fontFamily: 'zrnic',
//   fontStyle: 'normal',
//   fontDisplay: 'swap',
//   fontWeight: 400,
//   src: `
//     local('zrnic-rg'),
//     url(${Zrnic}) format('ttf')
//   `,
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
      main: 'rgba(174, 56, 43)',
    },
    text: {
      primary: 'rgb(170 161 85)',
      secondary: 'rgb(168 164 136)',
      disabled: 'rgb(168 164 136)',
      hint: 'rgba(174, 56, 43)',
    },
  },
  typography: {
    fontFamily: 'Zrnic',
    body1: {
      fontSize: '1.2rem',
    },
    body2: {
      fontSize: '1rem',
    },
    h1: {
      fontSize: '2.2rem',
    },
    h2: {
      fontSize: '2rem',
      color: 'rgb(0 225 217)',
    },
    h3: {
      fontSize: '1.8rem',
    },
    h4: {
      fontSize: '1.6rem',
      color: 'rgb(0 225 217)',
    },
    h5: {
      fontSize: '1.4rem',
    },
    h6: {
      fontFamily: 'Bebas Neue',
      fontSize: 30,
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
      color: 'rgb(185 231 229)',
    },
    // Used to display links
    caption: {
      wordBreak: 'break-word',
      fontStyle: 'italic',
      fontSize: '1rem',
      color: 'rgb(133 23 139)',
    },
  },
  overrides: {
    // MuiCssBaseline: {
    //   '@global': {
    //     '@font-face': [zrnic],
    //   },
    // },
    MuiButton: {
      root: {
        padding: 10,
        borderRadius: 10,
        fontSize: '1.1rem',
      },
    },
    MuiLink: {
      root: {
        cursor: 'pointer',
      },
    },
    // How to attach together ?
    MuiStepContent: {
      root: {
        borderColor: 'rgb(0 225 217)',
        borderLeft: '1px solid',
      },
    },
    MuiStepConnector: {
      line: {
        borderColor: 'rgb(0 225 217)',
        borderLeft: '1px solid',
      },
    },
    MuiSvgIcon: {
      root: {
        color: 'rgb(168 164 136)',
      },
    },
    MuiStepIcon: {
      root: {
        color: 'rgb(170 161 85)',
      },
    },
    MuiTextField: {
      root: {
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: 'rgb(0 225 217)',
          },
        },
      },
    },
  },
  props: {
    MuiButton: {
      disableRipple: true,
      variant: 'contained',
      color: 'primary',
    },
    MuiCheckbox: {
      disableRipple: true,
    },
    MuiLink: {
      variant: 'body2',
      color: 'primary',
      underline: 'none',
    },
  },
});

export default theme;
