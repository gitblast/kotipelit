import React from 'react';

import { Link } from 'react-router-dom';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Typography, Grid, Button } from '@material-ui/core';

// icon imports, bundling together requires "minimizing bundle size?"
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import AppsIcon from '@material-ui/icons/Apps';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import kotitonniImg from '../assets/images/KotitonniB.png';
import backgroundImg from '../assets/images/backgroundB.png';

import Footer from './Footer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mainContainer: {
      width: '100%',
      overflow: 'hidden',
      margin: 'auto',
      background: 'linear-gradient(to top, #c2e59c, #94ccc6)',
    },
    container: {
      padding: theme.spacing(2),
      textAlign: 'center',
    },
    media: { height: 150 },
    showcase: {
      height: 444,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      [theme.breakpoints.down('xs')]: {
        textAlign: 'center',
      },
    },

    mainInfo: {
      [theme.breakpoints.down('xs')]: {
        marginLeft: 0,
        alignSelf: 'flex-end',
        justifyContent: 'space-around',
        marginBottom: 14,
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
    section: {
      backgroundColor: 'rgba(245, 245, 248)',
    },
    flexin: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      [theme.breakpoints.down('xs')]: {
        textAlign: 'center',
      },
    },
    // Makes images responsive
    image: {
      width: '100%',
      height: 'auto',
    },
  })
);

// interface FrontPageProps {}

const FrontPage: React.FC = () => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.mainContainer}>
        <Grid container className={classes.showcase}>
          <Grid item sm></Grid>
          <Grid item sm={4} xs={12} className={classes.mainInfo}>
            <Typography color="primary" variant="h5">
              Peli-iltojen yhteinen osoite.
            </Typography>

            <Button
              variant="contained"
              color="secondary"
              className={classes.buttonStyle}
              component={Link}
              to="/kirjaudu"
            >
              Järjestä peli-ilta
            </Button>
          </Grid>
          <Grid item sm={5} xs={12}>
            <img
              className={classes.image}
              src={backgroundImg}
              alt="Background"
            />
          </Grid>
          <Grid item sm></Grid>
        </Grid>

        {/* Pelinhoitajainfo A */}
        <Grid container spacing={4} className={classes.container}>
          <Grid item xs={12}>
            <Typography color="primary" variant="h4">
              Järjestä kotipelit
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <AppsIcon></AppsIcon>
            <Typography variant="h5">
              Ilahduta järjestämällä peli-iltoja etänä.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <EuroSymbolIcon></EuroSymbolIcon>

            <Typography variant="h5">
              Voit halutessasi myös asettaa pelille hinnan ja tienata hauskalla
              tavalla.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <AccountCircleIcon></AccountCircleIcon>
            <Typography variant="h5">
              Tarvitset vain käyttäjätilin ja web-kameran niin olet valmis!
            </Typography>
          </Grid>
        </Grid>
        {/* Kotitonni-info */}
        <Grid container spacing={2} className={classes.flexin}>
          <Grid item sm={1}></Grid>
          <Grid item xs={12} sm={4}>
            <Typography color="primary" variant="h4">
              Kotitonni
            </Typography>

            <Typography variant="h5">
              Kotitonni on viihdyttävä peli, jossa pelaajat arvuuttelevat
              toistensa sanoja vihjeiden avulla. Eniten pisteitä saa kun vain
              yksi arvaa sanan. Peli kestää noin tunnin ja pyörii pelaamiseen
              kustomoidulla videopuhelualustalla.
            </Typography>
          </Grid>
          <Grid item sm={1}></Grid>
          <Grid item xs={12} sm={5}>
            <img className={classes.image} src={kotitonniImg} alt="Kotitonni" />
          </Grid>
          <Grid item sm={1}></Grid>
        </Grid>

        {/* Pelinhoitajainfo B */}
        <Grid container spacing={4} className={classes.container}>
          <Grid item xs={12}>
            <Typography color="primary" variant="h4">
              Kiinnostuitko?
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h5">
              Ota yhteyttä info@kotipelit.com ja voit aloittaa peli-iltojen
              järjestämisen.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h5">
              Peli-illan järjestäminen sivustolla on helppoa ja voit kysyä apua
              milloin vain.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h5">
              Halutessasi voimme järjestää pelaajat ensimmäistä peli-iltaasi
              varten.
            </Typography>
          </Grid>
        </Grid>
      </div>
      <Footer />
    </>
  );
};

export default FrontPage;
