import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Paper, Typography, Grid } from '@material-ui/core';

import spektaakkeliOneImg from '../assets/images/spektaakkeli1.png';
import spektaakkeliTwoImg from '../assets/images/spektaakkeli2.jpg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(2),
      margin: theme.spacing(4),
      '& > * + *': {
        margin: theme.spacing(2),
      },
    },
    spektaakkeliImage: {
      maxWidth: '100%',
    },
  })
);

const CompanyInfo = () => {
  const classes = useStyles();
  return (
    <>
      <Paper className={classes.container}>
        <Typography variant="h3" color="initial">
          Spektaakkeli Events
        </Typography>
        <Typography variant="body2" color="initial">
          Spektaakkeli Events on tapahtuma-alan yritys. Harrastustoimintana
          alkunsa saaneet ja monta vuotta pyörineet monipuoliset vapaa-ajan
          tapahtumat muuntuivat yritystoiminnaksi vuoden 2020 alussa. Tapahtumia
          on järjestetty urheilu- ja vapaa-ajan keskuksissa eri puolella Suomea
          ja Lanzarotella.
        </Typography>
        <Grid container spacing={5}>
          <Grid item md={4} xs={10}>
            <img
              src={spektaakkeliOneImg}
              alt="spektaakkeli"
              className={classes.spektaakkeliImage}
            />
          </Grid>
          <Grid item md={4} xs={10}>
            <img
              src={spektaakkeliTwoImg}
              alt="spektaakkeli"
              className={classes.spektaakkeliImage}
            />
          </Grid>
        </Grid>
        <Typography variant="body2" color="initial">
          Korona muutti kuitenkin toiminnan suuntaa ja tapahtumat siirtyivät
          nettiin. Spektaakkelin nettitapahtumat koostuvat erilaisista
          visailuista ja sosiaalisista peleistä - suurinosa videopuhelujen
          välityksellä.
        </Typography>
        <Typography variant="body2" color="initial">
          Kotipelit.com syntyi näiden nettitapahtumien päälle tarjoamaan
          erillisen alustan etänä pelattaville peleille, jotka ovat olleet
          tapahtumien suosituimpia. Pelaaminen ja muunlainen rento kilpailu on
          luonteva tapa pitää yhteyttä, tapahtui se sitten etänä tai
          paikanpäällä. Tätä sosiaalisten tapahtumien ja monipuolisen
          harrastamisen perinnettä jatkaa myös Kotipelit.com.
        </Typography>
      </Paper>
    </>
  );
};

export default CompanyInfo;
