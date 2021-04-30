import React from 'react';

import { Link } from 'react-router-dom';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Typography, Button, Grid } from '@material-ui/core';

import logoImg from '../assets/images/logoTransparent.png';

import VimeoMedia from './VimeoMedia';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mainContainer: {
      marginLeft: theme.spacing(1.5),
      marginRight: theme.spacing(1.5),
    },
    showcase: {
      marginTop: theme.spacing(4),
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
      },
    },
    showcaseImage: {
      height: 270,
      [theme.breakpoints.down('sm')]: {
        maxHeight: 250,
      },
      [theme.breakpoints.down('xs')]: {
        maxHeight: 190,
      },
    },
    mainInfo: {
      color: theme.palette.info.main,
      [theme.breakpoints.down('sm')]: {
        marginTop: theme.spacing(4),
        textAlign: 'center',
      },
    },
    subHeader: {
      fontSize: '1.1rem',
      color: theme.palette.text.primary,
    },
    headerBtn: {
      marginTop: theme.spacing(1.8),
    },

    sectionStyle: {
      margin: theme.spacing(8),
      // Undefined color (neon)
      color: 'rgb(0 225 217)',
      [theme.breakpoints.down('xs')]: {
        margin: theme.spacing(5),
      },
    },

    userBanner: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      margin: theme.spacing(4),
      [theme.breakpoints.down('sm')]: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: theme.spacing(2),
      },
    },
    sectionInfo: {
      alignSelf: 'center',
      '& > * + *': {
        margin: theme.spacing(2),
      },
      [theme.breakpoints.down('xs')]: {
        textAlign: 'center',
        margin: theme.spacing(1),
      },
    },
    companyBanner: {
      marginTop: theme.spacing(9),
      marginBottom: theme.spacing(9),
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'center',
      [theme.breakpoints.down('xs')]: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(4),
      },
    },
    neonDivider: {
      height: 3,
      background:
        'linear-gradient(to right, rgb(0 225 217), rgba(11, 43, 56, 1))',
      width: '75vw',
      alignSelf: 'center',
      marginTop: '6px',
    },

    bannerInfo: {
      margin: theme.spacing(8),
    },
    bannerBtn: {
      backgroundColor: 'rgb(36, 121, 117)',
      marginTop: theme.spacing(2),
      // Where does this get its default color without defining?
      color: theme.palette.text.primary,
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
      margin: theme.spacing(9),
      display: 'flex',
      justifyContent: 'space-around',
      textAlign: 'center',
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
      },
    },
    step: {
      textAlign: 'center',
      width: 34,
      height: 34,
      borderRadius: '50%',
    },
    stepFirstLast: {
      background: 'linear-gradient(to right, rgb(17 240 232), transparent)',
    },
    stepTwo: {
      background: 'linear-gradient(to right top, rgb(248 231 23), transparent)',
    },
    stepThree: {
      background: 'linear-gradient(to right, rgb(189 17 198), transparent)',
    },

    stepperContent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',

      '& > * + *': {
        marginTop: theme.spacing(2),
      },
      [theme.breakpoints.down('xs')]: {
        marginTop: theme.spacing(2),
      },
    },
  })
);

const Steps = () => {
  const classes = useStyles();
  return (
    <>
      <section className={classes.sectionBStyle}>
        <div className={classes.stepperContent}>
          <div className={`${classes.step} ${classes.stepFirstLast}`}></div>
          <Typography variant="body1" color="initial">
            Päätä ajankohta
          </Typography>
        </div>
        <div className={classes.stepperContent}>
          <div className={`${classes.step} ${classes.stepTwo}`}></div>
          <Typography variant="body1" color="initial">
            Valitse pelattava peli
          </Typography>
        </div>

        <div className={classes.stepperContent}>
          <div className={`${classes.step} ${classes.stepThree}`}></div>
          <Typography variant="body1" color="initial">
            Kustomoi
          </Typography>
        </div>

        <div className={classes.stepperContent}>
          <div className={`${classes.step} ${classes.stepFirstLast}`}></div>
          <Typography variant="body1" color="initial">
            Kutsu pelaajat
          </Typography>
        </div>
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
        <div className={classes.showcase}>
          <img
            src={logoImg}
            alt="background"
            className={classes.showcaseImage}
          />
          <div className={classes.mainInfo}>
            <Typography variant="h1" color="initial">
              Miksi katsoa TV-visailuja kun voit luoda omasi?
            </Typography>
            <Typography
              variant="h2"
              color="initial"
              className={classes.subHeader}
            >
              Peli-illat pelaamiseen kustomoidulla videopuhelualustalla
            </Typography>
            <Button
              color="secondary"
              component={Link}
              to="/kirjaudu"
              className={classes.headerBtn}
            >
              Järjestä kotipelit
            </Button>
          </div>
        </div>

        <section className={classes.companyBanner}>
          <div className={classes.neonDivider}></div>
          <div className={classes.bannerInfo}>
            <Typography variant="h2" color="initial">
              Etsitkö yrityksellesi juonnettua peli-iltaa?
            </Typography>
            <div>
              <Button
                component={Link}
                to="/yritystapahtumat"
                className={classes.bannerBtn}
              >
                Aloita tästä
              </Button>
            </div>
          </div>
          <div className={classes.neonDivider}></div>
        </section>
        <Grid container>
          <Grid item md sm></Grid>
          <Grid item md={5} sm={5} xs={12} className={classes.sectionInfo}>
            <Typography variant="h3" color="initial">
              Ilahduta juontamalla tutuillesi pelejä
            </Typography>
            <div>
              <Typography variant="body1">
                Tarvitset vain käyttäjätilin ja web-kameran
              </Typography>
              <Typography variant="body1" color="initial">
                ..ja olet valmis!
              </Typography>
            </div>
            <div>
              <Button color="secondary" component={Link} to="/rekisteroidy">
                Luo tili
              </Button>
            </div>
          </Grid>
          <Grid item md={5} sm={5} xs={12}>
            <VimeoMedia />
          </Grid>
          <Grid item md sm></Grid>
        </Grid>
        <Steps />
      </div>
    </div>
  );
};

export default FrontPage;
