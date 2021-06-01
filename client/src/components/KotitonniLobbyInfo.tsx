import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import VimeoMedia from './VimeoMedia';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    kotitonniSection: {
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
    },

    ruleComment: {
      textAlign: 'center',
    },
  })
);

const KotitonniLobbyInfo = () => {
  const classes = useStyles();
  return (
    <>
      <Grid container spacing={2} className={classes.kotitonniSection}>
        <Grid item md={1}></Grid>
        <Grid item md={5} xs={12}>
          <Typography
            variant="body1"
            color="initial"
            className={classes.ruleComment}
          >
            Kotitonni on hauska seurapeli, jossa sanallinen luovuus pääsee
            valloilleen.
          </Typography>
        </Grid>
        <Grid item md={5} xs={12}>
          <VimeoMedia />
        </Grid>
        <Grid item md={1}></Grid>
      </Grid>

      <Typography
        variant="body1"
        color="initial"
        className={classes.ruleComment}
      >
        Saat ilmottautuessasi kolme sanaa, joihin sinun tulee keksiä vihjeet.
      </Typography>

      <Typography
        variant="body1"
        color="initial"
        className={classes.ruleComment}
      >
        Tavoitteena, että vain yksi kanssapelaaja arvaa oikean sanan!
      </Typography>
    </>
  );
};

export default KotitonniLobbyInfo;
