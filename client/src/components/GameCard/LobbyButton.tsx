import React from 'react';

import FileCopyIcon from '@material-ui/icons/FileCopy';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Button, IconButton, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { RTCGame } from '../../types';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    actionIcon: {
      padding: theme.spacing(0.5),
      color: theme.palette.primary.light,
    },
  })
);

const useNotify = (delay: number = 2500) => {
  const [text, setText] = React.useState<string | null>(null);

  const handleRef = React.useRef<undefined | number>(undefined);

  React.useEffect(() => {
    if (handleRef.current) {
      return () => {
        clearTimeout(handleRef.current);
      };
    }
  }, []);

  const notify = React.useCallback(
    (msg: string) => {
      setText(msg);

      handleRef.current = window.setTimeout(() => setText(null), delay);
    },
    [delay]
  );

  return {
    notification: text,
    notify,
  };
};

interface LobbyButtonProps {
  game: RTCGame;
  hostName: string;
}

const LobbyButton = ({ game, hostName }: LobbyButtonProps) => {
  const classes = useStyles();

  const { notification, notify } = useNotify();

  const baseUrl =
    // eslint-disable-next-line no-undef
    process && process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://www.kotipelit.com';

  const getLobbyLink = () => {
    return `${baseUrl}/${hostName}/live/${game.id}`;
  };

  return (
    <div>
      <Button
        variant="text"
        color="primary"
        component={Link}
        to={`/${hostName}/kutsut/${game.id}`}
      >
        Peliaula
      </Button>
      <CopyToClipboard
        text={getLobbyLink()}
        onCopy={() => notify('Kopioitu leikepöydälle')}
      >
        <IconButton className={classes.actionIcon} aria-label="copy">
          <FileCopyIcon />
        </IconButton>
      </CopyToClipboard>
      <Typography variant="caption">Kopioi</Typography>
      {notification && (
        <Typography color="primary" variant="body2">
          {notification}
        </Typography>
      )}
    </div>
  );
};

export default LobbyButton;
