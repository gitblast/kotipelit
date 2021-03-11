import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(2),
      margin: theme.spacing(4),
    },
  })
);

const QuestionsAnswers = () => {
  const classes = useStyles();
  return (
    <>
      <Paper className={classes.container}>
        <Typography variant="h3" color="initial">
          Pelin järjestäjälle
        </Typography>
        <Typography variant="body1" color="initial">
          Maksaako pelien järjestäminen?
        </Typography>
        <Typography variant="body2" color="initial">
          Pelien järjestäminen ei maksa mitään. Sen sijaan voit halutessasi
          asettaa pelaajille hinnan, josta 80% tulee sinulle ja 20% käytetään
          Kotipelit-sivuston kehittämiseen.
        </Typography>
        <Typography variant="body1" color="initial">
          Voinko juontaa ystävilleni ilmaisia peli-iltoja?
        </Typography>
        <Typography variant="body2" color="initial">
          Peli-iltasi voi myös olla pelaajille ilmaisia ja alkuun näin
          suosittelemme tekemäänkin. Maksullisissa peleissä on kuitenkin
          vakaamman yhteyden lisäksi muita lisäominaisuuksia.
        </Typography>
        <Typography variant="body1" color="initial">
          Kuinka järjestän peli-illan?
        </Typography>
        <Typography variant="body2" color="initial">
          Kun olemme tehneet sinulle käyttäjätilin, näet profiilistasi ohjeet
          pelien luomiseen ja pisteiden yms. ylläpitämiseen pelien aikana.
        </Typography>
        <Typography variant="h3" color="initial">
          Pelaajille
        </Typography>
        <Typography variant="body1" color="initial">
          Tarvitsenko käyttäjätilin pelatakseni?
        </Typography>
        <Typography variant="body2" color="initial">
          Pelaajat eivät tarvitse käyttäjätiliä, mutta pelin järjestäjällä tulee
          olla tili voidaakseen luoda pelejä.
        </Typography>
        <Typography variant="body1" color="initial">
          Miksi maksaisin peli-illasta?
        </Typography>
        <Typography variant="body2" color="initial">
          80% peli-illan tuotosta menee pelin järjestäjälle, joka voi
          esimerkiksi olla ystäväsi tai sukulaisesi. Maksullisissa peleissä on
          myös vakaampi yhteys ja lisäominaisuuksia, mitä ilmaisissa peleissä ei
          ole.
        </Typography>
        <Typography variant="body1" color="initial">
          Miten voin tilata peli-illan ystävilleni, perheelle tai yritykselle?
        </Typography>
        <Typography variant="body2" color="initial">
          Voit ottaa yhteyttä info [at] kotipelit.com ja etsimme teidän
          ajankohdalle vapaan pelijuontajan. Tilatut pelit ovat aina
          maksullisia.
        </Typography>
      </Paper>
    </>
  );
};

export default QuestionsAnswers;
