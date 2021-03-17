import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import HeadsetIcon from '@material-ui/icons/Headset';
import Typography from '@material-ui/core/Typography/Typography';
import Button from '@material-ui/core/Button/Button';
import MediaPreview from './MediaPreview';
import { Fab } from '@material-ui/core';

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
  canJoin: boolean;
  handleJoinCall: () => void;
}

const PreGameInfo: React.FC<PreGameInfoProps> = ({
  handleJoinCall,
  canJoin,
}) => {
  const classes = useStyles();
  const [previewOpen, setPreviewOpen] = React.useState(false);

  return (
    <div className={classes.preInfo}>
      {canJoin ? (
        <>
          <Typography variant="h5">Peli alkaa pian!</Typography>
          <div className={classes.infoContent}>
            <HeadsetIcon fontSize="large"></HeadsetIcon>
            <Typography>
              Käytä kuulokkeita, niin pelin äänet eivät kuulu muille pelaajille
              läpi.
            </Typography>
          </div>
          <Button color="secondary" onClick={handleJoinCall} id="start">
            Käynnistä video
          </Button>
        </>
      ) : (
        <>
          <Typography variant="h5">
            Host ei ole vielä käynnistänyt peliä!
          </Typography>
          {previewOpen && (
            <div>
              <MediaPreview />
            </div>
          )}
          <Fab variant="extended" onClick={() => setPreviewOpen(!previewOpen)}>
            {previewOpen ? 'Lopeta testi' : 'Testaa kamera ja mikrofoni'}
          </Fab>
        </>
      )}
    </div>
  );
};

export default PreGameInfo;
