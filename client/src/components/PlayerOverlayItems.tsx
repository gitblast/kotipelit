import { Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import { Animated } from 'react-animated-css';
import useKotitonniOverlayItems from '../hooks/useKotitonniOverlayItems';
import { GameStatus, GameType, RTCParticipant } from '../types';
import logger from '../utils/logger';
import AnswerBubble from './AnswerBubble';
import DevItems from './DevItems';
import MediaControls from './MediaControls';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    nameBadge: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: theme.spacing(1),
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      width: '100%',
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(0.5),
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
      fontSize: theme.spacing(4),
      position: 'absolute',
      top: '4%',
      left: '80%',
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
    playerInfo: {
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
            <Animated
              animationIn="fadeIn"
              animationInDuration={2000}
              animationOut="fadeOut"
              isVisible={true}
            >
              <Typography variant="h6" className={classes.pointsAddition}>
                {pointAddition}
              </Typography>
            </Animated>
          </div>
        )}
        {forHost && answer && (
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
            <Typography variant="h6" className={classes.playerInfo}>
              {player.name}
            </Typography>

            <Typography variant="h6" className={classes.playerInfo}>
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
