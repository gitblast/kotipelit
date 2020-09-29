import React from 'react';

import { Link } from 'react-router-dom';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  Typography,
  Grid,
  Button,
  Paper,
  Card,
  CardMedia,
} from '@material-ui/core';

// icon imports, bundling together requires "minimizing bundle size?"
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import AppsIcon from '@material-ui/icons/Apps';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: { padding: theme.spacing(1), textAlign: 'center' },
    linkContainer: { marginTop: theme.spacing(2) },
    media: { height: 150 },
    showcase: {
      backgroundImage: 'url(images/background2.png)',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      backgroundSize: 'cover',
      height: 444,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      [theme.breakpoints.down('xs')]: {
        backgroundImage: 'url(images/background2Xs.png)',
      },
    },

    mainInfo: {
      marginLeft: 100,

      [theme.breakpoints.down('xs')]: {
        marginLeft: 0,
        alignSelf: 'flex-end',
        justifyContent: 'space-around',
        marginBottom: 14,
        width: '75%',
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
      backgroundColor: '#be780017',
    },
    flexin: {
      display: 'flex',
      alignItems: 'center',
    },
    marginLeft: {
      marginLeft: 10,
    },
  })
);

// interface FrontPageProps {}

const FrontPage: React.FC = () => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.showcase}>
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
      </div>

      <Paper elevation={1} className={classes.section}>
        {/* Pelinhoitajainfo A */}
        <Grid container spacing={4} className={classes.container}>
          <Grid item xs={12}>
            <Typography color="primary" variant="h4">
              Ryhdy pelinhoitajaksi
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <AppsIcon></AppsIcon>
            <Typography variant="h5">
              Ilahduta järjestämällä peli-iltoja.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <EuroSymbolIcon></EuroSymbolIcon>

            <Typography variant="h5">
              Voit asettaa pelin hinnan itse, 80% peli-illan tuotosta tulee
              sinulle.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <AccountCircleIcon></AccountCircleIcon>
            <Typography variant="h5">
              Tarvitsen vain käyttäjätilin ja webkameran niin olet valmis!
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      {/* Kotitonni-info */}
      <Paper>
        <Grid container spacing={4} className={classes.flexin}>
          <Grid item sm={1}></Grid>
          <Grid item xs={12} sm={4}>
            <Typography color="primary" variant="h4">
              Kotitonni
            </Typography>

            <Typography variant="h6">
              Kotitonnissa arvuutellaan kanssapelaajien sanoja vihjeiden avulla.
              Peli kestää noin tunnin ja pyörii pelaamiseen kustomoidulla
              videopuhelualustalla. Peli-illan kruunaa hyvä pelinhoitaja.
            </Typography>
          </Grid>
          <Grid item sm={1}></Grid>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardMedia
                component="img"
                image="images/Kotitonni.png"
                alt="Kotitonni"
              ></CardMedia>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={1} className={classes.section}>
        {/* Pelinhoitajainfo B */}
        <Grid container spacing={4} className={classes.container}>
          <Grid item xs={12}>
            <Typography color="primary" variant="h4">
              Kiinostuitko?
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h5">
              Ota yhteyttä info@kotipelit.com ja aloita tienaaminen hauskalla
              tavalla.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h5">
              Peli-illan järjestäminen on helppoa ja voit kysyä apua milloin
              vain.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h5">
              Halutessasi voimme järjestää sinulle pelaajat ensimmäistä
              peli-iltaasi varten.
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      <Paper>
        <Typography className={classes.container} variant="body2">
          &copy; 2020 Spektaakkeli Events
        </Typography>
      </Paper>
    </>
  );
};

export default FrontPage;
