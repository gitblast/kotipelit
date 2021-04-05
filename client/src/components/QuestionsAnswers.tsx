import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(2),
      margin: theme.spacing(4),
    },
    roleContent: {
      marginBottom: theme.spacing(3),
      '& > * + *': {
        margin: theme.spacing(1),
      },
    },
    roleTitle: {
      color: theme.palette.info.main,
    },
    roleSubtitle: {
      color: theme.palette.success.main,
    },
  })
);

const QuestionsAnswers = () => {
  const classes = useStyles();
  return (
    <>
      <div className={classes.container}>
        <div className={classes.roleContent}>
          <Typography variant="h3" className={classes.roleTitle}>
            Pelin järjestäjälle
          </Typography>
          <div>
            <Typography variant="body1" className={classes.roleSubtitle}>
              Maksaako pelien järjestäminen?
            </Typography>
            <Typography variant="body2" color="initial">
              Pelien järjestäminen ei maksa mitään. Toistaiseksi myös pelaaminen
              on täysin ilmaista. Kehitteillä on ominaisuus, jolla pelin
              juontajana voit halutessasi asettaa pelaajille hinnan, jonka
              tuotoista suurinosa tulisi sinulle ja osa käytetään
              Kotipelit-sivuston kehittämiseen.
            </Typography>
          </div>
          <div>
            <Typography variant="body1" className={classes.roleSubtitle}>
              Voinko juontaa ystävilleni jatkossakin ilmaisia peli-iltoja?
            </Typography>
            <Typography variant="body2" color="initial">
              Peli-iltasi voi jatkossakin olla pelaajille ilmaisia ja alkuun
              näin suosittelemme tekemäänkin. Maksullisissa peleissä tulee
              olemaan kuitenkin lisäominaisuuksia, joita ilmaispeleissä ei ole.
            </Typography>
          </div>
          <div>
            <Typography variant="body1" className={classes.roleSubtitle}>
              Kuinka järjestän peli-illan?
            </Typography>
            <Typography variant="body2" color="initial">
              Kun sinulla on käyttäjätili, saat luotua pelejä profiilistasi ja
              kutsuttua pelaajia vaivattomasti ilmoittautumislinkin avulla.
              Pisteiden päivitys yms. pelin toiminnot videopuhelun aikana ovat
              helppokäyttöisiä ja apua voi kysyä milloin vaan.
            </Typography>
          </div>
        </div>
        <div className={classes.roleContent}>
          <Typography variant="h3" className={classes.roleTitle}>
            Pelaajille
          </Typography>
          <div>
            <Typography variant="body1" className={classes.roleSubtitle}>
              Miten voin tilata peli-illan ystävilleni, perheelle tai
              yritykselle?
            </Typography>
            <Typography variant="body2" color="initial">
              Voit ottaa yhteyttä info [at] kotipelit.com ja etsimme teidän
              ajankohdalle vapaan pelijuontajan.
            </Typography>
          </div>
          <div>
            <Typography variant="body1" className={classes.roleSubtitle}>
              Tarvitsenko käyttäjätilin pelatakseni?
            </Typography>
            <Typography variant="body2" color="initial">
              Pelaajat eivät tarvitse käyttäjätiliä, mutta pelin juontajalla
              tulee olla tili voidaakseen järjestää pelejä.
            </Typography>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionsAnswers;
