import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { RTCKotitonniPlayer } from '../../types';
import { Typography } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import IconButton from '@material-ui/core/IconButton/IconButton';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    playerRow: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: theme.spacing(2),
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
        alignItems: 'normal',
      },
    },
    playerName: {},
    wordsRow: {
      display: 'flex',
      marginLeft: theme.spacing(4),
      [theme.breakpoints.down('xs')]: {
        marginLeft: theme.spacing(2),
      },
    },
    wordContainer: {
      display: 'flex',
      alignItems: 'center',
    },
  })
);

interface KotitonniPlayerPreviewProps {
  playerIndex: number;
  player: RTCKotitonniPlayer;
  handleRefresh: (playerId: string, index: number) => void;
}

const KotitonniPlayerPreview = ({
  player,
  playerIndex,
  handleRefresh,
}: KotitonniPlayerPreviewProps) => {
  const classes = useStyles();

  return (
    <div className={classes.playerRow}>
      <div className={classes.playerName}>
        <Typography>{`Pelaaja ${playerIndex + 1}`}</Typography>
      </div>
      <div className={classes.wordsRow}>
        {player.privateData.words.map((word, index) => (
          <div key={word}>
            <div className={classes.wordContainer}>
              {word}
              <IconButton
                size="small"
                onClick={() => handleRefresh(player.id, index)}
              >
                <RefreshIcon />
              </IconButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KotitonniPlayerPreview;
