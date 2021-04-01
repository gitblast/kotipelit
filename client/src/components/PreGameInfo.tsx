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
      marginTop: theme.spacing(2),
      '& > * + *': {
        marginBottom: theme.spacing(2),
      },
    },
    infoContent: {
      display: 'flex',
      margin: 15,
    },
    spectatorHead: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: theme.spacing(3),
    },
    tvText: {
      fontSize: '3.5rem',
      lineHeight: 0.7,
      color: theme.palette.info.main,
    },
    tvSubText: {
      color: theme.palette.success.main,
    },
    gameDescription: {
      color: 'rgb(185 231 229)',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
    },
  })
);

interface PreGameInfoProps {
  canJoin: boolean;
  handleJoinCall: (dev?: boolean) => void;
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
      {canJoin ? (
        <>
          {!isSpectator ? (
            <>
              <Typography variant="h5">Peli alkaa pian!</Typography>
              <div className={classes.infoContent}>
                <HeadsetIcon fontSize="large"></HeadsetIcon>
                <Typography>
                  Käytä kuulokkeita, niin pelin äänet eivät kuulu muille
                  pelaajille läpi.
                </Typography>
              </div>
            </>
          ) : (
            <>
              <div className={classes.spectatorHead}>
                <Typography variant="subtitle1" className={classes.tvText}>
                  Kotipelit-tv
                </Typography>
                <Typography variant="body2" className={classes.tvSubText}>
                  Peliviihdeillat oman porukan kesken
                </Typography>
              </div>
              <div className={classes.gameDescription}>
                <Typography variant="subtitle1">Kotitonni</Typography>
                <div className={classes.spectatorHead}>
                  <Typography variant="h3" color="initial">
                    Lähetys alkaa 16.4 klo 20.00
                  </Typography>
                  <Typography variant="body1" color="initial">
                    Katsojapaikkoja on rajoitettu määrä
                  </Typography>
                </div>
                <Typography variant="h5" color="initial">
                  Pelaamassa tänään:
                </Typography>
                <Typography variant="h5" color="initial">
                  Pelaaja, Pelaaja, Pelaaja, Pelaaja, Pelaaja,
                </Typography>
                <Typography variant="h5" color="initial">
                  Pelin juontaa:
                </Typography>
                <Typography variant="h5" color="initial">
                  Hostname
                </Typography>
              </div>
            </>
          )}
          <Button color="secondary" onClick={() => handleJoinCall()} id="start">
            {!isSpectator ? `Käynnistä peli` : `Siirry katsomaan`}
          </Button>
          {process.env.NODE_ENV === 'development' && (
            <Button
              color="secondary"
              onClick={() => handleJoinCall(true)}
              id="start-dev"
            >
              Käynnistä yhdistämättä Twilioon
            </Button>
          )}
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
        </>
      ) : (
        <>
          <Typography variant="h5">
            Odotetaan, että pelin juontaja käynnistää pelin..
          </Typography>
          {previewOpen && (
            <div>
              <MediaPreview />
            </div>
          )}
          <Button color="primary" onClick={() => setPreviewOpen(!previewOpen)}>
            {previewOpen ? 'Lopeta testi' : 'Testaa kamera ja mikrofoni'}
          </Button>
        </>
      )}
    </div>
  );
};

export default PreGameInfo;
