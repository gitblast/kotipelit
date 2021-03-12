import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import HeadsetIcon from '@material-ui/icons/Headset';
import SyncIcon from '@material-ui/icons/Sync';
import Typography from '@material-ui/core/Typography/Typography';
import Button from '@material-ui/core/Button/Button';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    preInfo: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      color: theme.palette.primary.light,
    },
    infoContent: {
      display: 'flex',

      margin: 15,
    },
  })
);

interface PreGameInfoProps {
  handleJoinCall: () => void;
}

const PreGameInfo: React.FC<PreGameInfoProps> = ({ handleJoinCall }) => {
  const classes = useStyles();

  return (
    <div className={classes.preInfo}>
      <Typography variant="h5">Peli alkaa pian!</Typography>
      <div className={classes.infoContent}>
        <HeadsetIcon fontSize="large"></HeadsetIcon>
        <Typography>
          Käytä kuulokkeita, niin pelin äänet eivät kuulu muille pelaajille
          läpi.
        </Typography>
      </div>
      <div className={classes.infoContent}>
        <SyncIcon fontSize="large"></SyncIcon>
        <Typography>
          Mikäli vastaamisessa on ongelmia, paina Refresh- ikonia.
        </Typography>
      </div>
      <Button color="secondary" onClick={handleJoinCall} id="start">
        Käynnistä video
      </Button>
    </div>
  );
};

export default PreGameInfo;
