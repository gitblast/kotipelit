import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import MicOffIcon from '@material-ui/icons/MicOff';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { GameType, State } from '../types';
import {
  Paper,
  Typography,
  IconButton,
  Tooltip,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';

import logger from '../utils/logger';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { setClicked } from '../reducers/localData.reducer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    badge: {
      margin: theme.spacing(1),
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      backgroundColor: 'darkgrey',
      color: 'white',
      opacity: 0.95,
      minWidth: 30,
    },
    hostBadge: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      margin: theme.spacing(1),
      backgroundColor: 'red',
      color: 'white',
      opacity: 0.95,
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
    tooltipRoot: {
      marginTop: '10%',
      marginRight: '30%',
    },
    tooltipContent: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
  })
);

interface PlayerOverlayItemsProps {
  playerId: string;
}

const PlayerOverlayItems: React.FC<PlayerOverlayItemsProps> = ({
  playerId,
}) => {
  const classes = useStyles();
  const clickMap = useSelector(
    (state: State) => state.rtc.localData?.clickedMap
  );
  const dispatch = useDispatch();
  const forHost = useSelector((state: State) => state.rtc.self?.isHost);
  const game = useSelector((state: State) => state.rtc.game);
  const player = useSelector(
    (state: State) => state.rtc.game?.players.find((p) => p.id === playerId),
    shallowEqual
  );
  const showPointAddition = React.useMemo(() => {
    if (!game) {
      return false;
    }

    return (
      // show is answering is closed and at least one player has answered
      !game.info.answeringOpen &&
      game.players.some((player) => {
        return (
          player.answers &&
          player.answers[game.info.round] &&
          player.answers[game.info.round].length
        );
      })
    );
  }, [game]);

  const checked = clickMap && clickMap[playerId];

  const handleChange = () => {
    dispatch(setClicked(playerId, !checked));
  };

  const getAnswer = () => {
    if (!game || !player || !player.answers) {
      return null;
    }

    const { turn, round } = game.info;

    const answers = player.answers[turn];

    if (!answers || !answers[round] || !answers[round].length) {
      return null;
    }

    return answers[round];
  };

  const answerBox = (answer: string) => {
    return (
      <Tooltip
        title={
          <div className={classes.tooltipContent}>
            <Typography variant="h4" component="div">
              {answer}
            </Typography>
          </div>
        }
        open={true}
        arrow={true}
        placement="top"
      >
        <div className={`${classes.spacer} ${classes.tooltipRoot}`} />
      </Tooltip>
    );
  };

  if (!game || !player) {
    return null;
  }

  const getPointAddition = (playerId: string, hasTurn: boolean): number => {
    const playerCount = game.players.length;
    const correctAnswers = game.players.reduce((sum, next) => {
      return clickMap && clickMap[next.id] ? sum + 1 : sum;
    }, 0);

    switch (correctAnswers) {
      case playerCount - 1: {
        return hasTurn ? -50 : 0;
      }
      case 0: {
        return hasTurn ? -50 : 0;
      }
      case 1: {
        return (clickMap && clickMap[playerId]) || hasTurn ? 100 : 0;
      }
      case 2: {
        return (clickMap && clickMap[playerId]) || hasTurn ? 30 : 0;
      }
      case 3: {
        return (clickMap && clickMap[playerId]) || hasTurn ? 10 : 0;
      }
    }

    return correctAnswers;
  };

  const answer = getAnswer();

  // handle different game types here
  if (game.type === GameType.KOTITONNI) {
    return (
      <div className={classes.flexCol}>
        <div className={classes.flex}>
          <div className={classes.spacer} />
          <Paper className={classes.badge}>
            <Typography>{player.points}</Typography>
          </Paper>
        </div>
        {true && ( // showPointAddition !!!
          <div className={classes.flex}>
            <div className={classes.spacer} />
            <Paper className={classes.badge}>
              <Typography>
                {getPointAddition(player.id, !!player.hasTurn)}
              </Typography>
            </Paper>
          </div>
        )}

        {forHost && answer ? (
          answerBox(answer)
        ) : (
          <div className={classes.spacer} />
        )}
        <div className={classes.flex}>
          <Paper className={classes.badge}>
            <Typography>{player.name}</Typography>
          </Paper>
          <div className={classes.spacer} />
          {forHost && answer && (
            <>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    value={checked}
                    onChange={handleChange}
                  />
                }
                label={<Typography variant="overline">Oikein</Typography>}
              />
              <div className={classes.spacer} />
            </>
          )}

          <IconButton size="small">
            <MicOffIcon />
          </IconButton>
          <IconButton size="small">
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
    );
  }

  logger.error('unknown game type');

  return null;
};

export default PlayerOverlayItems;
