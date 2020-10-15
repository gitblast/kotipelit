import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import MicOffIcon from '@material-ui/icons/MicOff';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { GamePlayer, GameType, RTCGame } from '../types';
import {
  Paper,
  Typography,
  IconButton,
  Tooltip,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';

import logger from '../utils/logger';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    pointsBadge: {
      margin: theme.spacing(0.5),
      padding: theme.spacing(1),
      borderRadius: '100%',
      backgroundColor: 'black',
      color: 'white',
      opacity: 0.8,
      minWidth: '10%',
    },
    nameBadge: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      backgroundColor: 'black',
      color: 'white',
      opacity: 0.8,
      minWidth: 30,
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
      marginTop: '5%',
      marginRight: '5%',
    },
    tooltipContent: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    // Repeating same code from HostOverlayItems
    controlIcon: {
      color: 'white',
    },
  })
);

interface PlayerOverlayItemsProps {
  player: GamePlayer;
  game: RTCGame;
  forHost?: boolean;
}

const PlayerOverlayItems: React.FC<PlayerOverlayItemsProps> = ({
  player,
  game,
  forHost,
}) => {
  const classes = useStyles();
  const [checked, setChecked] = React.useState(false);

  const handleChange = React.useCallback(() => {
    setChecked((curr) => !curr);
  }, []);

  const getAnswer = React.useCallback(() => {
    const { turn, round } = game.info;

    if (!player || !player.answers) {
      return <div className={classes.spacer} />;
    }

    const answers = player.answers[turn];

    if (!answers || !answers[round] || !answers[round].length) {
      return <div className={classes.spacer} />;
    }

    return (
      <Tooltip
        title={
          <div className={classes.tooltipContent}>
            <Typography variant="h4" component="div">
              {answers[round]}
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
  }, [game, player]);

  // handle different game types here
  if (game.type === GameType.KOTITONNI) {
    return (
      <div className={classes.flexCol}>
        <div className={classes.flex}>
          <div className={classes.spacer} />
          <Paper className={classes.pointsBadge}>
            <Typography variant="h6">{player.points}</Typography>
          </Paper>
        </div>

        {forHost ? getAnswer() : <div className={classes.spacer} />}
        <div className={classes.flex}>
          <Paper className={classes.nameBadge}>
            <Typography>{player.name}</Typography>
          </Paper>
          <div className={classes.spacer} />
          {forHost && (
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

          <IconButton size="small" className={classes.controlIcon}>
            <MicOffIcon />
          </IconButton>
          <IconButton size="small" className={classes.controlIcon}>
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
