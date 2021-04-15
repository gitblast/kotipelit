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
      textAlign: 'center',
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
      marginBottom: theme.spacing(2),
    },
    pointsBlock: {
      borderColor: '#00dfd7',
      border: 'solid 1px',
      borderRadius: '12%',
      padding: theme.spacing(1.5),
    },
    pointsBlockMinus: {
      borderColor: '#ee2626',
    },
  })
);

const KotitonniRulesBanner = () => {
  const classes = useStyles();

  return (
    <Paper elevation={5} className={classes.gameRules}>
      <Typography variant="body1">
        Kotitonni on hauska seurapeli, jossa sanallinen luovuus pääsee
        valloilleen. Saat kolme sanaa, joihin sinun tulee keksiä vihjeet.
        Tavoitteena on, että vain yksi kanssapelaaja arvaa oikean sanan.
      </Typography>

      <div className={classes.pointsExplained}>
        <div className={classes.pointsBlock}>
          <Typography variant="body1">1</Typography>
          <Typography variant="body1">+100</Typography>
        </div>
        <div className={classes.pointsBlock}>
          <Typography variant="body1">2</Typography>
          <Typography variant="body1">+30</Typography>
        </div>
        <div className={classes.pointsBlock}>
          <Typography variant="body1">3</Typography>
          <Typography variant="body1">+10</Typography>
        </div>
        <div className={`${classes.pointsBlock} ${classes.pointsBlockMinus}`}>
          <Typography variant="body1">0 / 4</Typography>
          <Typography variant="body1">-50</Typography>
        </div>
      </div>
      <Typography variant="body2" color="initial">
        Huom! Vältä antamasta sisäpiirivihjeitä, jotta kaikkien on mahdollista
        tietää oikea vastaus.
      </Typography>
    </Paper>
  );
};

export default KotitonniRulesBanner;
