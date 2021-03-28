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
      padding: theme.spacing(2),
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
      color: 'white',
      backgroundColor: 'rgb(34 110 108)',
      borderRadius: '50%',
      padding: theme.spacing(2),
      display: 'flex',
      justifyContent: 'flex-end',
      fontSize: theme.spacing(2.5),
      position: 'absolute',
      top: '4%',
      left: '80%',
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
    // Repeating same code from HostOverlayItems
    controlIcon: {
      color: 'white',
    },
    positionLabel: {
      position: 'absolute',
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      margin: theme.spacing(1),
    },
    playerName: {
      color: theme.palette.primary.light,
      [theme.breakpoints.down('sm')]: {
        fontSize: 18,
      },
    },
    playerPoints: {
      color: 'rgb(0 225 217)',
      [theme.breakpoints.down('sm')]: {
        fontSize: 18,
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
          <div>
            <Typography variant="h6" className={classes.pointsAddition}>
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
            <Typography variant="h6" className={classes.playerName}>
              {player.name}
            </Typography>

            <Typography variant="h6" className={classes.playerPoints}>
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
