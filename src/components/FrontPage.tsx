import React from 'react';

import { Link } from 'react-router-dom';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Typography, Grid, Button, Paper } from '@material-ui/core';

// icon imports, bundling together requires "minimizing bundle size?"
import AssignmentIcon from '@material-ui/icons/Assignment';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import AppsIcon from '@material-ui/icons/Apps';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import VideogameAssetIcon from '@material-ui/icons/VideogameAsset';

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
      },
    },
    buttonStyle: {
      padding: 20,
    },
    section: {
      backgroundColor: '#f8f8f8ff',
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
          <Typography color="primary" variant="h4">
            Peli-iltojen<br></br>yhteinen osoite.
          </Typography>

          <Button
            size="large"
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
        <Grid container>
          {/* Pelinhoitajainfo */}
          <Grid container spacing={4} className={classes.container}>
            <Grid item xs={12}>
              <Typography color="primary" variant="h4">
                Tienaa järjestämällä pelejä
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <AssignmentIcon></AssignmentIcon>

              <Typography>
                Järjestä etänä peli-iltoja tutuille tai tuntemattomille.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <EuroSymbolIcon></EuroSymbolIcon>

              <Typography>
                Tienaa hauskalla tavalla - suurinosa pelin tuotoista tulee
                sinulle.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <AppsIcon></AppsIcon>
              <Typography>
                Pelaamiseen kustomoitu videopuhelualusta tekee pelien
                järjestämisestä hauskaa ja vaivatonta.
              </Typography>
            </Grid>
          </Grid>
          {/* Pelaajainfo-osio */}
          <Grid container spacing={4} className={classes.container}>
            <Grid item xs={12}></Grid>
            <Grid item xs={12}>
              <Typography color="primary" variant="h4">
                Pelaa kavereiden kanssa
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <CheckCircleOutlineIcon></CheckCircleOutlineIcon>
              <Typography>Ei rekisteröitymistä.</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <AppsIcon></AppsIcon>
              <Typography>Pelaamiseen kustomoitu videopuhelualusta.</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <VideogameAssetIcon></VideogameAssetIcon>
              <Typography>Kasvava valikoima pelejä.</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default FrontPage;
