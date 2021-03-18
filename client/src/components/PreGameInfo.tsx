import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { isSupported } from 'twilio-video';

import HeadsetIcon from '@material-ui/icons/Headset';
import Typography from '@material-ui/core/Typography/Typography';
import Button from '@material-ui/core/Button/Button';
import MediaPreview from './MediaPreview';
import Alert from '@material-ui/lab/Alert';
import { Link } from '@material-ui/core';
import { AlertTitle } from '@material-ui/lab';

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
  isSpectator: boolean;
}

const PreGameInfo: React.FC<PreGameInfoProps> = ({
  handleJoinCall,
  canJoin,
  isSpectator,
}) => {
  const classes = useStyles();
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [alertOpen, setAlertOpen] = React.useState(!isSupported);

  return (
    <div className={classes.preInfo}>
      {!isSupported && alertOpen && (
        <Alert severity="info" onClose={() => setAlertOpen(false)}>
          <AlertTitle>
            Palvelu ei välttämättä toimi käyttämälläsi selaimella
          </AlertTitle>
          Jos peliin yhdistäminen ei onnistu, kokeile toista selainta. Näet
          tukemamme selaimet{' '}
          <Link href="https://www.twilio.com/docs/video/javascript#supported-browsers">
            täältä
          </Link>
          .
        </Alert>
      )}
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
        </>
      )}
      {!isSpectator && (
        <>
          {previewOpen && (
            <div>
              <MediaPreview />
            </div>
          )}
          <Button
            color="secondary"
            onClick={() => setPreviewOpen(!previewOpen)}
          >
            {previewOpen ? 'Lopeta testi' : 'Testaa kamera ja mikrofoni'}
          </Button>
        </>
      )}
    </div>
  );
};

export default PreGameInfo;
