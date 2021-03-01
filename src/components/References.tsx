import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Typography, Grid } from '@material-ui/core';

import matleenaImg from '../assets/images/matleena.png';
import teemuImg from '../assets/images/teemu.jpg';
import arviImg from '../assets/images/arvi.png';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    sectionB: {
      padding: theme.spacing(2),
      // This the same as in FrontPage content
      marginTop: theme.spacing(5),
      textAlign: 'center',
      color: theme.palette.primary.light,
      [theme.breakpoints.down('xs')]: {
        marginTop: 30,
      },
    },
    referenceImg: {
      marginBottom: theme.spacing(2),
      height: 160,
      borderRadius: '50%',
      border: 'solid 4px',
      borderColor: theme.palette.primary.main,
      boxShadow: 'rgb(231 239 191) 4px 3px 18px',
    },
    referenceTitle: {},
  })
);

const References = () => {
  const classes = useStyles();
  return (
    <>
      <Grid container className={classes.sectionB} spacing={5}>
        {/* Toistaa itseään, tee mahd. objekti jossa koottuja vihjeitä, vaihtele näkymää */}
        <Grid item md={4} xs={12}>
          <img className={classes.referenceImg} src={teemuImg} alt="Teemu" />
          <Typography variant="h5">
            {'"Hautajaishuijaus, johon et halua sijoittaa."'}
          </Typography>

          <Typography variant="body1">-Teemu</Typography>
        </Grid>
        <Grid item md={4} xs={12}>
          <img
            className={classes.referenceImg}
            src={matleenaImg}
            alt="Matleena"
          />
          <Typography variant="h5">
            {'"Jengi, joka aloitti metsästyksen 80-luvulla."'}
          </Typography>

          <Typography variant="body1">-Matleena</Typography>
        </Grid>
        <Grid item md={4} xs={12}>
          <img className={classes.referenceImg} src={arviImg} alt="arvi" />
          <Typography variant="h5">
            {'"Löytyy tähtimerkeistä ja Espanjasta."'}
          </Typography>

          <Typography variant="body1">-Arvi</Typography>
        </Grid>
      </Grid>
    </>
  );
};

export default References;
