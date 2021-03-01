import React from 'react';

import { Link } from 'react-router-dom';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Typography, Grid, Button } from '@material-ui/core';

import logoImg from '../assets/images/logo.png';
import gamehostImg from '../assets/images/gamehost.png';
import gameviewImg from '../assets/images/gameview.png';

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
    showcaseImage: {
      height: 347,
      [theme.breakpoints.down('xs')]: {
        maxHeight: 240,
      },
    },
    sectionStyle: {
      margin: theme.spacing(8),
      // Undefined color (neon)
      color: 'rgb(0 225 217)',
      [theme.breakpoints.down('xs')]: {
        margin: theme.spacing(5),
      },
    },
    sectionFlex: {
      display: 'flex',
      justifyContent: 'space-around',
      padding: theme.spacing(4),
      [theme.breakpoints.down('xs')]: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(2),
      },
    },
    sectionInfo: {
      margin: theme.spacing(5),
      alignSelf: 'center',
      '& > * + *': {
        margin: theme.spacing(2),
      },
      [theme.breakpoints.down('xs')]: {
        margin: 0,
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
      boxShadow: 'rgb(231 239 191) -23px 8px 44px',
      width: '11vw',
      alignSelf: 'center',
      marginTop: '6px',
    },
    gamehostImage: {
      height: 235,
      [theme.breakpoints.down('xs')]: {
        maxHeight: 210,
      },
    },
    gameviewImage: {
      height: 225,
      [theme.breakpoints.down('xs')]: {
        maxHeight: 200,
      },
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
      boxShadow: 'rgb(231 239 191) -1px 8px 44px',
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
  })
);

const Steps = () => {
  const classes = useStyles();
  return (
    <>
      <section className={classes.sectionBStyle}>
        <Grid container spacing={3} className={classes.stepper}>
          <Grid item md={3} sm={12} className={classes.stepperContent}>
            <div className={classes.step}>
              <Typography variant="h5" color="initial">
                1
              </Typography>
            </div>
            <Typography variant="body1" color="primary">
              Päätä ajankohta
            </Typography>
          </Grid>

          <Grid item md={3} sm={12} className={classes.stepperContent}>
            <div className={classes.step}>
              <Typography variant="h5" color="initial">
                2
              </Typography>
            </div>
            <Typography variant="body1" color="primary">
              Valitse pelattava peli
            </Typography>
          </Grid>

          <Grid item md={3} sm={12} className={classes.stepperContent}>
            <div className={classes.step}>
              <Typography variant="h5" color="initial">
                3
              </Typography>
            </div>
            <Typography variant="body1" color="primary">
              Aseta halutessasi pelaajille hinta
            </Typography>
          </Grid>

          <Grid item md={3} sm={12} className={classes.stepperContent}>
            <div className={classes.step}>
              <Typography variant="h5" color="initial">
                4
              </Typography>
            </div>
            <Typography variant="body1" color="primary">
              Kutsu pelaajat
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
          <img
            src={logoImg}
            alt="background"
            className={classes.showcaseImage}
          />
          <Button color="secondary" component={Link} to="/kirjaudu">
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
                ..voit myös tienata samalla!
              </Typography>
            </div>
            <img
              src={gamehostImg}
              alt="gamehost"
              className={classes.gamehostImage}
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
          <div className={classes.sectionFlex}>
            <div className={classes.sectionInfo}>
              <Typography variant="body1" color="initial">
                Tarvitset vain käyttäjätilin ja webkameran
              </Typography>
              <Typography variant="body1" color="initial">
                ..ja olet valmis!
              </Typography>
            </div>
            <img
              src={gameviewImg}
              alt="gameview"
              className={classes.gameviewImage}
            />
          </div>
        </section>
        <Steps />
        <References />
      </div>
    </div>
  );
};

export default FrontPage;
