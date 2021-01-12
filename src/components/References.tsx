import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Typography, Grid } from '@material-ui/core';

import matleenaImg from '../assets/images/matleena.png';
import teemuImg from '../assets/images/teemu.jpg';
import arviImg from '../assets/images/arvi.png';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    sectionB: {
      marginTop: theme.spacing(2),
      textAlign: 'center',
      [theme.breakpoints.down('xs')]: {
        marginTop: 30,
      },
    },
    referenceImg: {
      marginTop: theme.spacing(2),
      height: 160,
      borderRadius: '50%',
      border: 'solid white',
    },
  })
);

const References = () => {
  const classes = useStyles();
  return (
    <>
      <Grid container className={classes.sectionB} spacing={5}>
        {/* Toistaa itseään, tee mahd. objekti jossa koottuja vihjeitä, vaihtele näkymää */}
        <Grid item sm={4}>
          <Typography color="primary" variant="h5">
            {'"Hautajaishuijaus, johon et halua sijoittaa."'}
          </Typography>
          <img className={classes.referenceImg} src={teemuImg} alt="Teemu" />
          <Typography>Teemu</Typography>
        </Grid>
        <Grid item sm={4}>
          <Typography color="primary" variant="h5">
            {'"Jengi, joka aloitti metsästyksen 80-luvulla."'}
          </Typography>
          <img
            className={classes.referenceImg}
            src={matleenaImg}
            alt="Matleena"
          />
          <Typography>Matleena</Typography>
        </Grid>
        <Grid item sm={4}>
          <Typography color="primary" variant="h5">
            {'"Löytyy tähtimerkeistä ja Espanjasta."'}
          </Typography>
          <img className={classes.referenceImg} src={arviImg} alt="arvi" />
          <Typography>Arvi</Typography>
        </Grid>
      </Grid>
    </>
  );
};

export default References;
