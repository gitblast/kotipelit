import React from 'react';

import { capitalize } from 'lodash';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  Button,
  Typography,
  Paper,
  IconButton,
  Menu,
  MenuItem,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { SelectableGame } from '../../../types';
import { useDispatch } from 'react-redux';
import { deleteGame, startGame } from '../../../reducer/reducer';
import { useHistory, useLocation } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: theme.spacing(1),
      marginTop: theme.spacing(1),
      alignItems: 'center',
    },
    editButton: {
      marginLeft: theme.spacing(1),
    },
  })
);

interface QueuedGameProps {
  game: SelectableGame;
}

const QueuedGame: React.FC<QueuedGameProps> = ({ game }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const dispatch = useDispatch();
  const history = useHistory();

  /** @TODO get username from params, atm hardcoded */
  const username = useLocation().pathname;

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => setAnchorEl(null);

  const handleStart = (): void => {
    dispatch(startGame(game.id));
    history.push(`${username}/${game.id}`);
  };

  const handleRemove = (): void => {
    const agree = window.confirm('Poistetaanko peli?');

    if (agree) dispatch(deleteGame(game.id));
  };

  return (
    <Paper elevation={2} className={classes.container}>
      <div>
        <Typography>{game.startTime.toUTCString()}</Typography>
      </div>
      <div>
        <Typography>{capitalize(game.type)}</Typography>
      </div>
      <div>
        <Typography>{`${game.players.length} pelaajaa`}</Typography>
      </div>

      <div>
        <Button variant="contained" color="secondary" onClick={handleStart}>
          Käynnistä
        </Button>
        <IconButton
          size="small"
          className={classes.editButton}
          onClick={handleOpen}
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
          <MenuItem>
            <Typography>Muokkaa</Typography>
          </MenuItem>
          <MenuItem onClick={handleRemove}>
            <Typography color="secondary">Poista</Typography>
          </MenuItem>
        </Menu>
      </div>
    </Paper>
  );
};

export default QueuedGame;
