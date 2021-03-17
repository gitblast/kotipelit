import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Typography, Paper } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    gameRules: {
      padding: theme.spacing(3),
      marginTop: theme.spacing(3),
      marginLeft: theme.spacing(6),
      marginRight: theme.spacing(6),
      color: theme.palette.primary.light,
      // Create a palette variable
      [theme.breakpoints.down('xs')]: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
      },
    },
    pointsExplained: {
      display: 'flex',
      justifyContent: 'space-around',
      textAlign: 'center',
      marginTop: theme.spacing(2),
    },
  })
);

const KotitonniRulesBanner = () => {
  const classes = useStyles();

  return (
    <Paper className={classes.gameRules}>
      <Typography variant="body1">
        Kotitonnissa saat kolme sanaa, joihin sinun tulee keksiä vihjeet. Mitä
        harvempi pelaaja arvaa sanan, sitä enemmän pisteitä saat.
      </Typography>
      <Typography variant="body1" color="initial">
        Vältä antamasta sisäpiirivihjeitä, jotta kaikkien on mahdollista tietää
        oikea vastaus.
      </Typography>
      <div className={classes.pointsExplained}>
        <div>
          <Typography variant="body2">Yksi oikein</Typography>
          <Typography variant="body2">+100</Typography>
        </div>
        <div>
          <Typography variant="body2">Kaksi oikein</Typography>
          <Typography variant="body2">+30</Typography>
        </div>
        <div>
          <Typography variant="body2">Kolme oikein</Typography>
          <Typography variant="body2">+10</Typography>
        </div>
        <div>
          <Typography variant="body2">Nolla tai kaikki oikein</Typography>
          <Typography variant="body2">-50</Typography>
        </div>
      </div>
    </Paper>
  );
};

export default KotitonniRulesBanner;
