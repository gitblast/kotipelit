import React from 'react';

import { Link } from 'react-router-dom';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Typography, Grid, Button } from '@material-ui/core';

// icon imports, bundling together requires "minimizing bundle size?"
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import AppsIcon from '@material-ui/icons/Apps';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import logoImg from '../assets/images/logo.png';
// https://www.istockphoto.com/vector/quiz-show-neon-light-icons-set-gm1172576058-325355775
import gamehostImg from '../assets/images/gamehost.png';
import backgroundImg from '../assets/images/backgroundB.png';

import Footer from './Footer';
import References from './References';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mainContainer: {
      marginLeft: theme.spacing(1.5),
      marginRight: theme.spacing(1.5),
    },
    container: {
      marginTop: theme.spacing(5),
      textAlign: 'center',
    },
    showcase: {
      marginTop: theme.spacing(4),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    sectionStyle: {
      margin: theme.spacing(8),
      color: 'rgb(0 225 217)',
    },
    sectionFlex: {
      display: 'flex',
      justifyContent: 'space-around',
      padding: theme.spacing(4),
    },
    sectionInfo: {
      margin: theme.spacing(5),
      alignSelf: 'center',
      '& > * + *': {
        margin: theme.spacing(2),
      },
    },
    headline: {
      display: 'flex',
      justifyContent: 'center',
    },
    neonLight: {
      height: 3,
      background:
        'linear-gradient(to right, rgb(0 225 217), rgba(11, 43, 56, 1))',
      boxShadow: 'rgb(231 239 191) 1px 8px 44px',
      width: '11vw',
      alignSelf: 'center',
      marginTop: '6px',
    },
    gamehost: {
      maxHeight: 215,
    },
    sectionBStyle: {
      padding: theme.spacing(8),
    },
    stepper: {
      textAlign: 'center',
    },
    step: {
      textAlign: 'center',
      width: 28,
      height: 28,
      borderRadius: '50%',
      backgroundColor: 'rgb(226 205 55)',
    },
    stepNeon: {
      borderTop: 'solid 4px rgb(250 227 74)',
      background: 'rgb(167 203 176)',
      boxShadow: 'rgb(231 239 191) 1px 8px 44px',
      alignSelf: 'center',
      marginTop: '6px',
    },
    stepperContent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
    },
    buttonStyle: {
      padding: 12,
      marginTop: 20,
      marginLeft: 40,
      // Asettelu melko vammasesti tehty
      [theme.breakpoints.down('xs')]: {
        marginTop: 10,
        marginLeft: 0,
      },
    },

    flex: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    // Fix these, wickedish solution
    image: {
      width: '100%',
      height: 'auto',
      textAlign: 'center',
    },
    imageMobile: {
      height: 347,
    },
  })
);

const GamePreview = () => {
  const classes = useStyles();
  return <>{/* Kotitonni-info */}</>;
};

const Steps = () => {
  const classes = useStyles();
  return (
    <>
      <section className={classes.sectionBStyle}>
        <Grid container spacing={2} className={classes.stepper}>
          <Grid item sm={2} className={classes.stepperContent}>
            <div className={classes.step}>1</div>
            <Typography variant="body1" color="primary">
              Päätä ajankohta
            </Typography>
          </Grid>
          <Grid item sm={3}>
            <div className={classes.stepNeon}></div>
          </Grid>
          <Grid item sm={2} className={classes.stepperContent}>
            <div className={classes.step}>2</div>
            <Typography variant="body1" color="primary">
              Valitse pelattava peli
            </Typography>
          </Grid>
          <Grid item sm={3}>
            <div className={classes.stepNeon}></div>
          </Grid>
          <Grid item sm={2} className={classes.stepperContent}>
            <div className={classes.step}>3</div>
            <Typography variant="body1" color="primary">
              Aseta halutessasi pelaajille hinta
            </Typography>
          </Grid>
        </Grid>
        <div></div>
      </section>
    </>
  );
};

// interface FrontPageProps {}

const FrontPage: React.FC = () => {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.mainContainer}>
        <Grid container className={classes.showcase}>
          <img src={logoImg} alt="background" className={classes.imageMobile} />
          <Button
            variant="contained"
            color="secondary"
            className={classes.buttonStyle}
            component={Link}
            to="/kirjaudu"
          >
            Järjestä kotipelit
          </Button>
        </Grid>
        <section className={classes.sectionStyle}>
          <div className={classes.headline}>
            <div className={classes.neonLight}></div>
            <Typography variant="h3" color="initial">
              Ryhdy gameshow-juontajaksi
            </Typography>
          </div>
          <div className={classes.sectionFlex}>
            <div className={classes.sectionInfo}>
              <Typography variant="body1" color="initial">
                Ilahduta järjestämällä peli-iltoja
              </Typography>
              <Typography variant="body1" color="initial">
                ..tienaa samalla hauskalla tavalla
              </Typography>
            </div>
            <img
              src={gamehostImg}
              alt="gamehost"
              className={classes.gamehost}
            />
          </div>
        </section>
        <section className={classes.sectionStyle}>
          <div className={classes.headline}>
            <div className={classes.neonLight}></div>
            <Typography variant="h3" color="initial">
              Pelaamiseen kustomoidulla videopuhelualustalla
            </Typography>
          </div>
          <div className={classes.sectionInfo}>
            <Typography variant="body1" color="initial">
              Tarvitset vain käyttäjätilin ja webkameran
            </Typography>
            <Typography variant="body1" color="initial">
              ..ja olet valmis!
            </Typography>
          </div>
        </section>
        <Steps />
        <References />
        <GamePreview />
      </div>
      <Footer />
    </div>
  );
};

export default FrontPage;
