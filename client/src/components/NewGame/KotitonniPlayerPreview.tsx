import React from 'react';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import { RTCKotitonniPlayer } from '../../types';
import { Typography } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import IconButton from '@material-ui/core/IconButton/IconButton';

const useStyles = makeStyles(() =>
  createStyles({
    playerRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    playerRowItem: {
      flex: 1,
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
      <div className={classes.playerRowItem}>
        <Typography>{`Pelaaja ${playerIndex + 1}`}</Typography>
      </div>
      {player.privateData.words.map((word, index) => (
        <div key={word} className={classes.playerRowItem}>
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
  );
};

export default KotitonniPlayerPreview;
