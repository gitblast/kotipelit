import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

import Zrnic from './assets/fonts/zrnic-rg.ttf';
import BeautySchoolDropoutII from './assets/fonts/BeautySchoolDropoutII.woff';
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
    url(${BeautySchoolDropoutII}) format('woff')
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

let theme = createMuiTheme({
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
      main: '#d5c44b',
    },
    // Used in highlighted information, i.e. Host name in Gamelobby
    success: {
      main: '#d517df',
    },
    text: {
      primary: '#e6e3c5ff',
      secondary: 'rgb(168 164 136)',
      disabled: 'rgb(96 95 89)',
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
      // Color hould be defined somewhere else?
      color: '#e6e3c5ff',
    },
    h1: {
      fontSize: '1.9rem',
    },
    h2: {
      fontSize: '1.7rem',
    },
    h3: {
      fontSize: '1.5rem',
    },
    h4: {
      fontSize: '1.5rem',
    },
    h5: {
      fontSize: '1.4rem',
    },
    // No use atm
    h6: {
      fontSize: '1.2rem',
    },
    subtitle1: {
      fontSize: '3rem',
    },
    subtitle2: {
      fontSize: 36,
      lineHeight: 0.6,
      // info.main
      color: 'rgb(241 220 74)',
    },
    // Used to display links
    caption: {
      wordBreak: 'break-word',
      fontStyle: 'italic',
      fontSize: '1rem',
      color: 'rgb(135 135 135)',
    },
    // Used to display Kotipelit, probably better to use another typo variant
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
        '@font-face': [zrnic, beautySchoolDropoutII, chicagoNeon],
      },
    },
    MuiButton: {
      root: {
        paddingTop: 7,
        paddingBottom: 7,
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
      contained: {
        '&:hover': {
          backgroundColor: 'rgb(17 60 77)',
        },
      },
      text: {
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 12,
        paddingRight: 12,
        border: 0,
        color: '#d6d6d6',
        background: '#143340',
        '&:hover': {
          color: 'rgb(168 164 136)',
        },
      },
    },
    MuiLink: {
      root: {
        cursor: 'pointer',
        underline: 'none',
      },
    },
    MuiList: {
      root: {
        backgroundColor: '#e6e3c5ff',
        // general background color
        color: 'rgb(11 43 56)',
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
      last: {
        marginLeft: 0,
      },
    },
    MuiStepConnector: {
      line: {
        borderColor: 'rgb(0 225 217)',
        borderLeft: '1px solid',
      },
    },
    // Defines the underline in text-fields
    MuiInputBase: {
      root: {
        minWidth: 300,
      },
    },
    MuiSvgIcon: {
      root: {
        color: '#e6e3c5ff', // Text primary color
      },
    },
    MuiStepIcon: {
      root: {
        color: 'rgb(170 161 85)',
      },
      text: {
        // Removes numbers inside Stepper icons
        fill: 'none',
      },
    },
    MuiTextField: {
      root: {
        '& > * + *': {
          marginBottom: 8, // Prevents login fields to be stacked together and adds margin to next element
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
        backgroundColor: 'rgb(11, 43, 56)', // Same as background
      },
    },
  },
  props: {
    MuiButton: {
      disableRipple: true,
      variant: 'contained',
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

theme = responsiveFontSizes(theme);

export default theme;
