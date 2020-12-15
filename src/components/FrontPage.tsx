import React from 'react';

import { Link } from 'react-router-dom';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Typography, Grid, Button, Paper, Container } from '@material-ui/core';

// icon imports, bundling together requires "minimizing bundle size?"
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import AppsIcon from '@material-ui/icons/Apps';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import kotitonniImg from '../assets/images/Kotitonni.png';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mainContainer: {
      width: '90%',
      margin: 'auto',
    },
    container: {
      padding: theme.spacing(2),
      textAlign: 'center',
    },
    media: { height: 150 },
    showcase: {
      backgroundImage: 'url(images-css/background2.png)',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      backgroundSize: 'cover',
      height: 444,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      [theme.breakpoints.down('xs')]: {
        backgroundImage: 'url(images-css/background2Xs.png)',
      },
    },

    mainInfo: {
      marginLeft: 100,

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
    sectionB: {
      marginBottom: 15,
    },
    flexin: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
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
    <div className={classes.mainContainer}>
      <Container className={classes.showcase}>
        <div className={classes.mainInfo}>
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
        </div>
      </Container>

      <Paper elevation={1} className={classes.section}>
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
      </Paper>
      {/* Kotitonni-info */}
      <Paper className={classes.sectionB}>
        <Grid container spacing={2} className={classes.flexin}>
          <Grid item sm={1}></Grid>
          <Grid item xs={12} sm={4}>
            <Typography color="primary" variant="h4">
              Kotitonni
            </Typography>

            <Typography variant="h6">
              Kotitonni on viihdyttävä peli, jossa pelaajat arvuuttelevat
              toistensa sanoja vihjeiden avulla. Eniten pisteitä saa kun vain
              yksi arvaa sanan. Peli kestää noin tunnin ja pyörii pelaamiseen
              kustomoidulla videopuhelualustalla.
            </Typography>
          </Grid>
          <Grid item sm={1}></Grid>
          <Grid item xs={12} sm={6}>
            <img className={classes.image} src={kotitonniImg} alt="Kotitonni" />
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={1} className={classes.section}>
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
      </Paper>
    </div>
  );
};

export default FrontPage;
