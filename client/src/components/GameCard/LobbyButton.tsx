import React from 'react';

import FileCopyIcon from '@material-ui/icons/FileCopy';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Button, IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { RTCGame } from '../../types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    actionIcon: {
      padding: theme.spacing(0.5),
      color: theme.palette.primary.light,
    },
  })
);

interface LobbyButtonProps {
  game: RTCGame;
  hostName: string;
}

const LobbyButton = ({ game, hostName }: LobbyButtonProps) => {
  const classes = useStyles();

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to={`/${hostName}/kutsut/${game.id}`}
      >
        Peliaula
      </Button>
      <IconButton className={classes.actionIcon} aria-label="copy">
        {/* This should copy output of getLobbyLink() */}
        <FileCopyIcon />
      </IconButton>
    </div>
  );
};

export default LobbyButton;
