import React from 'react';

import MoreVertIcon from '@material-ui/icons/MoreVert';

import fiLocale from 'date-fns/locale/fi';

import { useDispatch } from 'react-redux';
import { deleteGame } from '../../reducers/games.reducer';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  CardHeader,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  capitalize,
} from '@material-ui/core';
import { format } from 'date-fns';
import { RTCGame } from '../../types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatarStyle: {
      background: theme.palette.secondary.main,
    },
  })
);

interface GameCardHeaderProps {
  game: RTCGame;
}

const GameCardHeader = ({ game }: GameCardHeaderProps) => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleRemove = (): void => {
    const agree = window.confirm('Poistetaanko peli?');

    if (agree) dispatch(deleteGame(game.id));
  };

  const handleClose = (): void => setAnchorEl(null);

  return (
    <CardHeader
      avatar={
        <Avatar aria-label="Game" className={classes.avatarStyle}>
          K
        </Avatar>
      }
      action={
        <>
          <IconButton
            aria-label="settings"
            onClick={handleOpen}
            color="primary"
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            getContentAnchorEl={null}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <MenuItem disabled>
              <Typography>Muokkaa</Typography>
            </MenuItem>
            <MenuItem onClick={handleRemove}>
              <Typography color="secondary">Poista</Typography>
            </MenuItem>
          </Menu>
        </>
      }
      title={<Typography variant="h3">{capitalize(game.type)}</Typography>}
      subheader={
        <Typography variant="body1">
          {format(new Date(game.startTime), 'd. MMMM HH:mm', {
            locale: fiLocale,
          })}{' '}
        </Typography>
      }
    />
  );
};

export default GameCardHeader;
