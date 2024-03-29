import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { format } from 'date-fns';
import fiLocale from 'date-fns/locale/fi';
import enLocale from 'date-fns/locale/en-US';
import { isSupported } from 'twilio-video';

import HeadsetIcon from '@material-ui/icons/Headset';
import Typography from '@material-ui/core/Typography/Typography';
import Button from '@material-ui/core/Button/Button';
import MediaPreview from './MediaPreview';
import Alert from '@material-ui/lab/Alert';
import { Link } from '@material-ui/core';
import { AlertTitle } from '@material-ui/lab';
import { Role, RTCGame, GameStatus } from '../types';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    preInfo: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: theme.spacing(2),
      '& > * + *': {
        marginBottom: theme.spacing(2),
      },
    },
    infoContent: {
      margin: theme.spacing(2),
      textAlign: 'center',
      '& > * + *': {
        margin: theme.spacing(2),
      },
    },
    spectatorHead: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: theme.spacing(3),
    },
    tvText: {
      fontSize: '3rem',
      lineHeight: 0.7,
      color: theme.palette.info.main,
      fontFamily: 'BeautySchoolDropoutII',
      textTransform: 'uppercase',
    },
    tvGame: {
      fontFamily: 'BeautySchoolDropoutII',
      textTransform: 'uppercase',
      fontSize: '2.3rem',
    },
    gameDescription: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
    },
    celebraties: {
      color: theme.palette.info.main,
    },
  })
);

interface PreGameInfoProps {
  game: RTCGame;
  handleJoinCall: (dev?: boolean) => void;
  role: Role;
}

const PreGameInfo: React.FC<PreGameInfoProps> = ({
  handleJoinCall,
  game,
  role,
}) => {
  const classes = useStyles();

  const { t, i18n } = useTranslation();

  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [alertOpen, setAlertOpen] = React.useState(!isSupported);

  const canJoin = role === Role.HOST || game.status !== GameStatus.UPCOMING;

  return (
    <div className={classes.preInfo}>
      <>
        {role !== Role.SPECTATOR ? (
          <>
            <div className={classes.infoContent}>
              <HeadsetIcon></HeadsetIcon>
              <Typography variant="body1">
                {t('preGameInfo.useHeadphones')}
              </Typography>
              {role === Role.HOST && (
                <Typography variant="body1" color="initial">
                  {t('preGameInfo.canSilence')}
                </Typography>
              )}
            </div>
            {previewOpen && (
              <div>
                <MediaPreview />
              </div>
            )}

            <Button variant="text" onClick={() => setPreviewOpen(!previewOpen)}>
              {previewOpen ? t('mediaTest.stop') : t('mediaTest.start')}
            </Button>
            {!isSupported && alertOpen && (
              <Alert severity="info" onClose={() => setAlertOpen(false)}>
                <AlertTitle>{t('preGameInfo.browserAlert.title')}</AlertTitle>
                {t('preGameInfo.browserAlert.info')}
                <Link href="https://www.twilio.com/docs/video/javascript#supported-browsers">
                  {t('preGameInfo.browserAlert.link')}
                </Link>
                .
              </Alert>
            )}
          </>
        ) : (
          // Spectator pregame view
          <>
            <div className={classes.spectatorHead}>
              <Typography variant="h1" className={classes.tvText}>
                Kotipelit-tv
              </Typography>
            </div>
            <div className={classes.gameDescription}>
              <div className={classes.spectatorHead}>
                <Typography variant="body1" color="initial">
                  {`${t('preGameInfo.spectator.broadcastStarts')} ${format(
                    new Date(game.startTime),
                    'd.M. HH:mm',
                    {
                      locale: i18n.language === 'en' ? enLocale : fiLocale,
                    }
                  )}`}
                </Typography>
                <Typography variant="body2" color="initial">
                  {t('preGameInfo.spectator.limited')}
                </Typography>
              </div>
              <Typography variant="h2" className={classes.tvGame}>
                {t('common.kotitonni')}
              </Typography>
              <Typography variant="body1" color="initial">
                {t('preGameInfo.spectator.playing')}
              </Typography>
              <Typography
                variant="h5"
                color="initial"
                className={classes.celebraties}
              >
                {game.players.map((p) => p.name).join(', ')}
              </Typography>
              <Typography variant="h5" color="initial">
                {t('preGameInfo.spectator.hosting')}
              </Typography>
              <Typography
                variant="h5"
                color="initial"
                className={classes.celebraties}
              >
                {game.host.displayName}
              </Typography>
            </div>
          </>
        )}
        {
          <>
            {!canJoin && (
              <Typography variant="body2">
                {t('preGameInfo.waiting')}
              </Typography>
            )}
            <Button
              color="secondary"
              onClick={() => handleJoinCall()}
              id="start"
              disabled={!canJoin}
            >
              {role !== Role.SPECTATOR
                ? t('preGameInfo.startGame')
                : t('preGameInfo.spectate')}
            </Button>
            {process.env.NODE_ENV === 'development' && (
              <Button
                color="secondary"
                onClick={() => handleJoinCall(true)}
                id="start-dev"
                disabled={!canJoin}
              >
                Käynnistä yhdistämättä Twilioon
              </Button>
            )}
          </>
        }
      </>
    </div>
  );
};

export default PreGameInfo;
