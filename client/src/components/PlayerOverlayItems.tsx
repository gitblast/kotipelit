import { Typography, Button } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import useKotitonniOverlayItems from '../hooks/useKotitonniOverlayItems';
import { GameStatus, GameType, RTCParticipant } from '../types';
import logger from '../utils/logger';
import AnswerBubble from './AnswerBubble';
import DevItems from './DevItems';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import MediaControls from './MediaControls';
import AnimatedCounter from './AnimatedCounter';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    nameBadge: {
      display: 'flex',
      justifyContent: 'space-around',
      padding: theme.spacing(0.8),
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderTop: 'dotted 3px rgb(0 225 217)',
      color: 'white',
      width: '100%',
      clipPath: 'polygon(10% 0, 90% 0, 91% 4%, 100% 100%, 0 100%, 8% 5%)',
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(0.5),
      },
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
    flexCol: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    flex: {
      display: 'flex',
    },
    spacer: {
      // fills empty space
      flex: '1 1 auto',
    },

    pointsAddition: {
      backgroundColor: 'black',
      width: '100%',
      padding: theme.spacing(0.5),
      display: 'flex',
      justifyContent: 'center',
      position: 'absolute',
      color: 'rgb(0 225 217)',
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
    pointsEV: {
      color: 'rgb(0 225 217)',
    },
    positionLabel: {
      position: 'absolute',
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      margin: theme.spacing(1),
    },
    playerName: {
      fontFamily: 'beautySchoolDropoutII',
      textTransform: 'uppercase',
      fontSize: '2.1rem',
      [theme.breakpoints.down('sm')]: {
        fontSize: '1.1rem',
      },
    },
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
    playerPoints: {
      fontFamily: 'beautySchoolDropoutII',
      fontSize: '2.1rem',
      color: 'rgb(0 225 217)',
      [theme.breakpoints.down('sm')]: {
        fontSize: '1.1rem',
      },
    },
    skipBtn: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: theme.spacing(2),
    },
  })
);

interface PlayerOverlayItemsProps {
  participant: RTCParticipant;
}

const PlayerOverlayItems: React.FC<PlayerOverlayItemsProps> = ({
  participant,
}) => {
  const classes = useStyles();
  const isWideEnough = useMediaQuery('(min-width:550px)');

  const {
    game,
    player,
    pointAddition,
    answer,
    showPointAddition,
    forHost,
    skipPlayer,
  } = useKotitonniOverlayItems(participant.id);

  if (!player) {
    return null;
  }

  // const getPosition = () => {
  //   const pos = game.players
  //     .map((player) => player.points)
  //     .sort((a, b) => b - a)
  //     .indexOf(player.points);

  //   return pos + 1;
  // };

  // handle different game types here
  if (game.type === GameType.KOTITONNI) {
    return (
      <div className={classes.flexCol}>
        <DevItems
          forHost={forHost}
          hostName={game.host.displayName}
          isMe={participant.isMe}
          inviteCode={player?.privateData?.inviteCode}
        />
        {forHost &&
          game.status === GameStatus.RUNNING &&
          player.hasTurn &&
          (!participant.connection ||
            participant.connection.state === 'disconnected') && (
            <div className={classes.skipBtn}>
              <Button onClick={skipPlayer}>Skippaa</Button>
            </div>
          )}
        {forHost && showPointAddition && pointAddition !== 0 && (
          <div className={classes.pointsAddition}>
            <Typography variant="body2" className={classes.pointsEV}>
              {pointAddition >= 0 && `+ `}
            </Typography>
            <Typography variant="body2" className={classes.pointsEV}>
              {pointAddition}
            </Typography>
          </div>
        )}
        {forHost && answer && isWideEnough && (
          <AnswerBubble answer={answer} playerId={participant.id} />
        )}
        {game.status === GameStatus.FINISHED && (
          <div className={classes.positionLabel}>
            {/* Final position expressed later with animations */}
            {/* <Typography variant="h3">{getPosition()}</Typography> */}
          </div>
        )}

        <div className={classes.spacer} />
        <div className={classes.flex}>
          <div className={classes.nameBadge}>
            <Typography variant="h3" className={classes.playerName}>
              {player.name}
            </Typography>
            <AnimatedCounter currentValue={player.points} />
            <div>
              <MediaControls participant={participant} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  logger.error('unknown game type');

  return null;
};

export default PlayerOverlayItems;
