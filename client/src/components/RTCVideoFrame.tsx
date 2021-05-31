import { Card, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGameData, useMediaMutedStates } from '../context';
import useParticipantTracks from '../hooks/useParticipantTracks';
import { GameStatus, RTCParticipant } from '../types';
import HostOverlayItems from './HostOverlayItems';
import PlayerOverlayItems from './PlayerOverlayItems';
import VideoWithOverlay from './VideoWithOverlay';

type PropStyles = {
  order: number;
};

const colors = [
  'rgba(219, 154, 0, 0.8)',
  'rgba(165, 27, 82, 0.8)',
  'rgba(20, 115, 151, 0.8)',
  'rgba(64, 147, 5, 0.8)',
  'rgb(0 225 217)',
  'rgba(104, 95, 97, 0.8)',
];

const useStyles = makeStyles<Theme, PropStyles>((theme: Theme) =>
  createStyles({
    videoWindow: {
      boxSizing: 'border-box',
      width: `28%`,
      background: (props) => `${colors[props.order]}`,
      borderBottom: '4px dotted white',
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(1),
      [theme.breakpoints.down('sm')]: {
        width: '28%',
        marginLeft: theme.spacing(0.5),
        marginRight: theme.spacing(0.5),
        marginTop: 0,
        marginBottom: theme.spacing(0.2),
      },
    },
    frame: {
      paddingTop: '75%',
      backgroundColor: 'rgba(11,43,56)',
      position: 'relative',
    },
    hasTurn: {
      background: (props) => `${colors[props.order]}`,
      boxShadow: 'rgb(231 239 191) 4px 3px 18px',
      border: '5px dotted white',
      [theme.breakpoints.down('xs')]: {
        width: '29%',
        zIndex: 2,
        position: 'absolute',
        top: '26%',
        left: '3%',
      },
    },
    hostStyle: {
      border: '2px solid rgb(0 225 217)',
      [theme.breakpoints.down('xs')]: {
        order: '-2 !important',
        width: '95%',
      },
    },
    notActive: {
      [theme.breakpoints.down('xs')]: {
        width: '22%',
      },
    },
    placeHolderText: {
      position: 'absolute',
      top: '50%',
      bottom: 0,
      left: 0,
      right: 0,
      color: 'rgba(218, 214, 214)',
      textAlign: 'center',
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
    absolute: {
      width: '100%',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  })
);

interface RTCVideoFrameProps {
  participant: RTCParticipant;
  order: number; // defines the order of video windows
}

const ErrorMsg: React.FC<{ text: string }> = ({ text, children }) => {
  const classes = useStyles({ order: 0 });

  return (
    <div className={classes.frame}>
      <div className={classes.placeHolderText}>
        <Typography variant="body2">{text}</Typography>
      </div>
      <div className={classes.absolute}>{children}</div>
    </div>
  );
};

const RTCVideoFrame: React.FC<RTCVideoFrameProps> = ({
  participant,
  order,
}) => {
  const { t } = useTranslation();
  const [videoTrack, audioTrack] = useParticipantTracks(participant);
  const { mutedMap } = useMediaMutedStates();
  const classes = useStyles({ order });
  const { game } = useGameData();
  const gameStatus = game.status;
  const playerWithTurnId = game.info.turn;
  const style = React.useMemo(() => ({ order }), [order]);

  const isMuted = !!participant.isMe || !!mutedMap[participant.id];

  const overlayContent = () => {
    return participant.isHost ? (
      <HostOverlayItems host={participant} />
    ) : (
      <PlayerOverlayItems participant={participant} />
    );
  };

  const highlighted =
    playerWithTurnId &&
    playerWithTurnId === participant.id &&
    gameStatus &&
    gameStatus === GameStatus.RUNNING;

  return (
    <Card
      elevation={5}
      className={`${classes.videoWindow} ${
        highlighted
          ? classes.hasTurn
          : participant.isHost
          ? classes.hostStyle
          : classes.notActive
      }`}
      style={style}
    >
      {videoTrack && audioTrack ? (
        <VideoWithOverlay
          videoTrack={videoTrack}
          audioTrack={audioTrack}
          isMuted={isMuted}
        >
          {overlayContent()}
        </VideoWithOverlay>
      ) : (
        <div>
          <ErrorMsg text={t('game.waitingForPlayer')}>
            {overlayContent()}
          </ErrorMsg>
        </div>
      )}
    </Card>
  );
};

export default React.memo(RTCVideoFrame);
