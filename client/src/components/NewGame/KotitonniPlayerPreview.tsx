import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { RTCKotitonniPlayer } from '../../types';
import { Typography, Button } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    playerRow: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: theme.spacing(1),
    },
    wordsRow: {
      display: 'flex',
    },
    wordRefreshBtn: {
      color: theme.palette.primary.light,
      [theme.breakpoints.down('xs')]: {
        fontSize: 12,
      },
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
      <div>
        <Typography variant="body2">{`Pelaaja ${playerIndex + 1}`}</Typography>
      </div>
      <div className={classes.wordsRow}>
        {player.privateData.words.map((word, index) => (
          <div key={word}>
            <Button
              variant="text"
              onClick={() => handleRefresh(player.id, index)}
              className={classes.wordRefreshBtn}
            >
              {word}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KotitonniPlayerPreview;
