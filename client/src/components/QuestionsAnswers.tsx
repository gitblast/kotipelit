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
          Pelien järjestäminen ei maksa mitään. Toistaiseksi myös pelaaminen on
          täysin ilmaista. Kehitteillä on ominaisuus, jolla pelin juontajana
          voit halutessasi asettaa pelaajille hinnan, josta 80% tulisi sinulle
          ja 20% käytetään Kotipelit-sivuston kehittämiseen.
        </Typography>
        <Typography variant="body1" color="initial">
          Voinko juontaa ystävilleni jatkossakin ilmaisia peli-iltoja?
        </Typography>
        <Typography variant="body2" color="initial">
          Peli-iltasi voi jatkossakin olla pelaajille ilmaisia ja alkuun näin
          suosittelemme tekemäänkin. Maksullisissa peleissä tulee olemaan
          kuitenkin vakaamman yhteyden lisäksi muitakin lisäominaisuuksia.
        </Typography>
        <Typography variant="body1" color="initial">
          Kuinka järjestän peli-illan?
        </Typography>
        <Typography variant="body2" color="initial">
          Kun olemme tehneet sinulle käyttäjätilin, saat luotua pelejä ja
          kutsuttua kavereita helposti peliin ilmottatumislinkin avulla.
          Pisteiden päivitys yms. pelin toiminnot videopuhelun aikana ovat
          helppokäyttöisiä ja apua voi kysyä milloin vaan.
        </Typography>
        <Typography variant="h3" color="initial">
          Pelaajille
        </Typography>
        <Typography variant="body1" color="initial">
          Tarvitsenko käyttäjätilin pelatakseni?
        </Typography>
        <Typography variant="body2" color="initial">
          Pelaajat eivät tarvitse käyttäjätiliä, mutta pelin juontajalla tulee
          olla tili voidaakseen luoda pelejä.
        </Typography>
        <Typography variant="body1" color="initial">
          Miksi maksaisin peli-illasta?
        </Typography>
        <Typography variant="body2" color="initial">
          80% peli-illan tuotosta menee pelin juontajalle, joka voi esimerkiksi
          olla ystäväsi tai sukulaisesi. Maksullisissa peleissä on myös vakaampi
          yhteys ja lisäominaisuuksia, mitä ilmaisissa peleissä ei ole.
        </Typography>
        <Typography variant="body1" color="initial">
          Miten voin tilata peli-illan ystävilleni, perheelle tai yritykselle?
        </Typography>
        <Typography variant="body2" color="initial">
          Voit ottaa yhteyttä info [at] kotipelit.com ja etsimme teidän
          ajankohdalle vapaan pelijuontajan.
        </Typography>
      </Paper>
    </>
  );
};

export default QuestionsAnswers;
