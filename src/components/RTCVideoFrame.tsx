import { Card, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import { useSelector } from 'react-redux';
import useParticipantTracks from '../hooks/useParticipantTracks';
import { GameStatus, RTCParticipant, State } from '../types';
import HostOverlayItems from './HostOverlayItems';
import PlayerOverlayItems from './PlayerOverlayItems';
import VideoWithOverlay from './VideoWithOverlay';

type PropStyles = {
  order: number;
};

const colors = [
  'rgba(251, 232, 0, 0.8)',
  'rgba(165, 27, 82, 0.8)',
  'rgba(20, 115, 151, 0.8)',
  'rgba(26, 139, 71, 0.8)',
  'rgb(0 225 217)',
  'rgba(238, 255, 244, 0.8)',
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
        width: '32%',
        margin: 3,
      },
    },
    frame: {
      paddingTop: '75%',
      backgroundColor: 'rgba(11,43,56)',
      position: 'relative',
      color: 'white',
    },
    hasTurn: {
      background: (props) => `${colors[props.order]}`,
      boxShadow: 'rgb(231 239 191) 4px 3px 18px',
      border: '7px dotted white',
      [theme.breakpoints.down('xs')]: {
        width: '95%',
      },
    },
    hostStyle: {
      [theme.breakpoints.down('xs')]: {
        width: '95%',
      },
    },
    notActive: {
      [theme.breakpoints.down('xs')]: {
        display: 'none',
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
  const [videoTrack, audioTrack] = useParticipantTracks(participant);
  const classes = useStyles({ order });
  const gameStatus = useSelector((state: State) => state.rtc.game?.status);
  const playerWithTurnId = useSelector(
    (state: State) => state.rtc.game?.info.turn
  );
  const style = React.useMemo(() => ({ order }), [order]);

  const isMuted = useSelector(
    (state: State) =>
      !!state.rtc.localData.mutedMap[participant.id] || !!participant.isMe
  );

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
      elevation={3}
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
          <ErrorMsg text={'Odotetaan pelaajaa..'}>{overlayContent()}</ErrorMsg>
        </div>
      )}
    </Card>
  );
};

export default React.memo(RTCVideoFrame);
