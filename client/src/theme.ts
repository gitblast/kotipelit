import { createMuiTheme } from '@material-ui/core/styles';

import Zrnic from './assets/fonts/zrnic-rg.ttf';
import BeautySchoolDropoutII from './assets/fonts/BeautySchoolDropoutII.ttf';
import BeautySchoolDropout from './assets/fonts/BeautySchoolDropout.ttf';
import ChicagoNeon from './assets/fonts/ChicagoNeon.ttf';

// Instructions (Self hosted fonts) https://material-ui.com/customization/typography/

const zrnic = {
  fontFamily: 'Zrnic',
  fontStyle: 'normal',
  fontWeight: 400,
  src: `
    local('Zrnic'),
    url(${Zrnic}),
    url(${Zrnic}) format('ttf')
  `,
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2035, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
};

const beautySchoolDropoutII = {
  fontFamily: 'BeautySchoolDropoutII',
  fontStyle: 'normal',
  fontWeight: 400,
  src: `
    local('BeautySchoolDropoutII'),
    url(${BeautySchoolDropoutII}),
    url(${BeautySchoolDropoutII}) format('ttf')
  `,
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2035, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
};

const beautySchoolDropout = {
  fontFamily: 'BeautySchoolDropout',
  fontStyle: 'normal',
  fontWeight: 400,
  src: `
    local('BeautySchoolDropout'),
    url(${BeautySchoolDropout}),
    url(${BeautySchoolDropout}) format('ttf')
  `,
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2035, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
};

const chicagoNeon = {
  fontFamily: 'ChicagoNeon',
  fontStyle: 'normal',
  fontWeight: 400,
  src: `
    local('ChicagoNeon'),
    url(${ChicagoNeon}),
    url(${ChicagoNeon}) format('ttf')
  `,
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2035, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
};

const theme = createMuiTheme({
  palette: {
    primary: {
      light: 'rgb(168 164 136)',
      main: 'rgb(142 135 78)',
      dark: 'rgb(103 93 13)',
      contrastText: 'rgba(240, 240, 240)',
    },
    secondary: {
      light: 'rgba(175, 113, 161)',
      main: 'rgb(133 23 139)',
      dark: 'rgba(81 38 99)',
      contrastText: 'rgba(214, 214, 214)',
    },
    error: {
      main: 'rgba(135, 56, 43)',
    },
    // Used in important information, like in gamelobby invitation
    info: {
      main: '#f1dc4a',
    },
    // Used in highlighted information, i.e. Host name in Gamelobby
    success: {
      main: '#d517df',
    },
    text: {
      primary: 'rgb(170 161 85)',
      secondary: 'rgb(168 164 136)',
      disabled: 'rgb(168 164 136)',
      hint: 'rgba(135, 56, 43)',
    },
  },
  typography: {
    fontFamily: 'Zrnic, Roboto',
    body1: {
      fontSize: '1.3rem',
    },
    body2: {
      fontSize: '1rem',
      // primary light
      color: 'rgb(168 164 136)',
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
      fontFamily: 'beautySchoolDropout',
      fontSize: 30,
      lineHeight: 1,
    },
    subtitle1: {
      fontFamily: 'beautySchoolDropoutII',
      textTransform: 'uppercase',
      fontSize: '3rem',
      lineHeight: '1',
    },
    // Used to display the game name and host name in GameRoom
    subtitle2: {
      fontFamily: 'beautySchoolDropoutII',
      textTransform: 'uppercase',
      fontSize: 30,
      lineHeight: 1,
    },
    // Used to display links
    caption: {
      wordBreak: 'break-word',
      fontStyle: 'italic',
      fontSize: '1rem',
      color: 'rgb(135 135 135)',
    },
    // Used to display Kotipelit, probably better to use another typo variant
    overline: {
      fontFamily: 'chicagoNeon',
      fontSize: '3.4rem',
      lineHeight: 1,
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 550,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-face': [
          zrnic,
          beautySchoolDropoutII,
          beautySchoolDropout,
          chicagoNeon,
        ],
      },
    },
    MuiButton: {
      root: {
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 12,
        paddingRight: 12,
        borderRadius: 10,
        fontSize: '1.2rem',
        border: 'solid 0.5px white',
        // Why affects only variant"text" ?
        '&$disabled': {
          color: 'rgb(92 92 92)',
        },
      },
    },
    MuiLink: {
      root: {
        cursor: 'pointer',
        underline: 'none',
      },
    },
    MuiLinearProgress: {
      /// Undefined color (neon)
      barColorPrimary: {
        background: 'linear-gradient(to right, rgb(185 231 229), transparent)',
        backgroundColor: 'transparent',
      },
      bar2Indeterminate: {
        animation:
          'MuiLinearProgress-keyframes-indeterminate2 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) 1.15s infinite',
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
    MuiInputBase: {
      root: {
        minWidth: 240,
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
        '& > * + *': {
          marginBottom: 8,
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: 'rgb(0 225 217)',
          },
        },
        '& .MuiInput-underline:before': {
          borderColor: 'rgb(0 225 217)',
        },
      },
    },
    MuiPaper: {
      root: {
        // Ligth version of background
        backgroundColor: 'rgb(15 47 60)',
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
