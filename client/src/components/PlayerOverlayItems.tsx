import { Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import useKotitonniOverlayItems from '../hooks/useKotitonniOverlayItems';
import { GameStatus, GameType, RTCParticipant } from '../types';
import logger from '../utils/logger';
import AnswerBubble from './AnswerBubble';
import DevItems from './DevItems';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import MediaControls from './MediaControls';

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
      fontSize: theme.spacing(4.5),
      color: theme.palette.primary.light,
      [theme.breakpoints.down('sm')]: {
        fontSize: '1.2rem',
      },
    },
    playerPoints: {
      fontSize: '2.6rem',
      color: 'rgb(0 225 217)',
      [theme.breakpoints.down('sm')]: {
        fontSize: '1.5rem',
      },
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
          isMe={participant.isMe}
          inviteCode={player?.privateData?.inviteCode}
        />
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
            <Typography variant="subtitle1" className={classes.playerName}>
              {player.name}
            </Typography>

            <Typography variant="subtitle1" className={classes.playerPoints}>
              {player.points}
            </Typography>
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
