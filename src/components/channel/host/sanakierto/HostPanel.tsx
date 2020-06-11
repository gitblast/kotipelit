import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Typography, Fab } from '@material-ui/core';

import ScoreBoard from './ScoreBoard';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(1),
    },
    flex: {
      display: 'flex',
      alignItems: 'center',
    },
    grow: {
      flexGrow: 1,
    },
  })
);

// interface HostPanelProps {}

const HostPanel: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Typography variant="h6">Kierros 1</Typography>
      <div className={classes.flex}>
        <div className={classes.grow}>
          <Typography
            variant="overline"
            component="div"
            className={classes.grow}
          >
            Vuorossa:
          </Typography>
          <Typography component="div" gutterBottom>
            Pete
          </Typography>
        </div>
        <div className={classes.grow}>
          <Typography
            variant="overline"
            component="div"
            className={classes.grow}
          >
            Sanat:
          </Typography>
          <Typography component="div" gutterBottom>
            Aski / Matto / Kirja
          </Typography>
        </div>
      </div>
      <div>
        <Typography variant="overline" component="div">
          Selitysaika:
        </Typography>
        <div className={classes.flex}>
          <Typography component="div" className={classes.grow}>
            90 sekuntia
          </Typography>
          <div className={classes.grow}>
            <Fab variant="extended" size="small" color="secondary">
              Käynnistä
            </Fab>
          </div>
        </div>
      </div>
      <ScoreBoard />
    </div>
  );
};

export default HostPanel;
