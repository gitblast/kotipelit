import React from 'react';

import { Link } from 'react-router-dom';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
} from '@material-ui/core';

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
      backgroundImage: 'url(images/background.png)',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      backgroundSize: 'cover',
      height: 444,
      width: '100%',
    },
    hostCard: {
      minWidth: 200,
      maxWidth: 200,
      margin: 'auto',
      borderStyle: 'solid',
      border: 1,
    },
    gameCard: {
      minWidth: 'fit',
    },
    gameMedia: {
      height: 160,
    },
    cardMedia: {
      height: 133,
      width: 133,
      margin: 'auto',
    },
  })
);

// interface FrontPageProps {}

const FrontPage: React.FC = () => {
  const classes = useStyles();

  return (
    // <div className={classes.container}>
    //   <Typography variant="h3">Kanavat:</Typography>
    //   <div className={classes.linkContainer}>
    //     <Button color="primary" component={Link} to="/matleena" variant="outlined">
    //       Matleena
    //     </Button>
    //   </div>
    //   <div className={classes.linkContainer}>
    //     <Button component={Link} to="/matleena" variant="outlined">
    //       Batleena
    //     </Button>
    //   </div>
    //   <div className={classes.linkContainer}>
    //     <Button component={Link} to="/matleena" variant="outlined">
    //       Catleena
    //     </Button>
    //   </div>
    // </div>

    <Grid container spacing={8} className={classes.container}>
      <Grid container className={classes.showcase}>
        <Grid item xs={12}></Grid>
        <Grid item xs={12}></Grid>

        <Grid item xs={5}>
          <Typography color="primary" variant="h4">
            Peli-iltojen yhteinen osoite.
          </Typography>
        </Grid>
        <Grid item xs={12}></Grid>
      </Grid>
      {/* Pelaajainfo-osio */}
      <Grid container spacing={4} className={classes.container}>
        <Grid item xs={12}></Grid>
        <Grid item xs={12}>
          <Typography color="secondary" variant="h4">
            Pelaa kotoa käsin
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
      {/* Pelivalikoima */}
      {/* <Grid item xs={12} sm={4}>
        <Card className={classes.gameCard}>
          <CardActionArea>
            <CardMedia
              className={classes.gameMedia}
              image="images/kiertoilmaus.png"
            />

            <CardContent>
              <Typography>
                Kiertoilmaus perustuu tv-konsepti Kymppitonniin. Pelaajat saavat
                ennen peliä pelinhoitajalta 3 sanaa, joille pelaajien tulee
                keksiä kiertoilmaukset.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card className={classes.gameCard}>
          <CardActionArea>
            <CardMedia
              className={classes.gameMedia}
              image="images/piinapenkki.png"
            />

            <CardContent>
              <Typography>
                {' '}
                Piinapenkissä arvuutellaan mitä kanssapelaaja ajattelee.
                Piinapenkissä vastaillaan kysymyksiin, joihin on mahdototonta
                tietää oikeata vastausta.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card className={classes.gameCard}>
          <CardActionArea>
            <CardMedia
              className={classes.gameMedia}
              image="images/tietovisailu.png"
            />

            <CardContent>
              <Typography>
                {' '}
                Tulossa myöhemmin.. Säännöt palalalalalalalalalal
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid> */}
      {/* Pelinhoitajainfo */}
      <Grid container spacing={4} className={classes.container}>
        <Grid item xs={12}>
          <Typography color="secondary" variant="h4">
            ..tai liity pelinhoitajaksi
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
            Tienaa hauskalla tavalla - suurinosa pelin tuotoista tulee sinulle.
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

      {/* Pelinhoitajavalikoima */}
      {/* <Grid item xs={12} sm={4}>
        <Card className={classes.hostCard}>
          <CardActionArea component={Link} to="/matleena">
            <CardMedia className={classes.cardMedia} image="images/user.png" />

            <CardContent>
              <Typography variant="h5">Matleena</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card className={classes.hostCard}>
          <CardActionArea>
            <CardMedia className={classes.cardMedia} image="images/user.png" />

            <CardContent>
              <Typography variant="h6">Liity pelinhoitajaksi</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card className={classes.hostCard}>
          <CardActionArea>
            <CardMedia className={classes.cardMedia} image="images/user.png" />

            <CardContent>
              <Typography variant="h6">Liity pelinhoitajaksi</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid> */}
    </Grid>
  );
};

export default FrontPage;
