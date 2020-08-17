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
import {
  SelectableGame,
  Sanakierto,
  SanakiertoPlayer,
  GameStatus,
} from '../../types';
import { useDispatch } from 'react-redux';
import { deleteGame } from '../../reducers/games.reducer';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginTop: theme.spacing(1),
      padding: theme.spacing(2),
    },
    infoBar: {
      alignItems: 'center',
    },
    flex: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    editButton: {
      marginLeft: theme.spacing(1),
    },
    playerRow: {},
    inviteText: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  })
);

/** @TODO invitetext function */

const getInviteUrl = (hostName: string, playerId: string): string =>
  `https://www.kotipelit.com/${hostName}/${playerId}`;

const getInviteText = (
  game: Sanakierto,
  hostName: string,
  player: SanakiertoPlayer
): string =>
  `Tervetuloa pelaamaan ${capitalize(game.type)}a!
  
Sanasi ovat: ${player ? player.words.join(' ') : '<Pelaajan sanat>'}
      
Tehtävänäsi on miettiä sanoille niitä kuvaavat vihjeet.
      
Peli alkaa ${new Date(game.startTime).toUTCString()}
      
Nähdään peleillä osoitteessa:
${getInviteUrl(hostName, player.id)}`;

interface QueuedGameProps {
  game: SelectableGame;
  username: string;
}

const QueuedGame: React.FC<QueuedGameProps> = ({ game, username }) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [inviteText, setInviteText] = React.useState<null | string>(null);
  const dispatch = useDispatch();

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => setAnchorEl(null);

  const handleRemove = (): void => {
    const agree = window.confirm('Poistetaanko peli?');

    if (agree) dispatch(deleteGame(game.id));
  };

  const showInviteText = (
    game: SelectableGame,
    hostName: string,
    player: SanakiertoPlayer
  ): void => {
    setInviteText(getInviteText(game, hostName, player));
  };

  return (
    <Paper elevation={2} className={classes.container}>
      <div className={`${classes.infoBar} ${classes.flex}`}>
        <div>
          <Typography>{new Date(game.startTime).toUTCString()}</Typography>
        </div>
        <div>
          <Typography>{capitalize(game.type)}</Typography>
        </div>
        <div>
          <Typography>{`${game.players.length} pelaajaa`}</Typography>
        </div>

        <div>
          {game.status === GameStatus.UPCOMING && (
            <Button
              variant="contained"
              color="secondary"
              component={Link}
              to={`/${username}/pelit/${game.id}`}
            >
              Käynnistä
            </Button>
          )}
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
            <MenuItem disabled>
              <Typography>Muokkaa</Typography>
            </MenuItem>
            <MenuItem onClick={handleRemove}>
              <Typography color="secondary">Poista</Typography>
            </MenuItem>
          </Menu>
        </div>
      </div>
      <div>
        <Typography variant="h6" gutterBottom>
          Pelaajat
        </Typography>
        {game.players.map((player) => (
          <div
            key={player.id}
            className={`${classes.flex} ${classes.playerRow}`}
          >
            <Typography component="div">{player.name}</Typography>
            <Typography component="div">{player.words.join(' / ')}</Typography>
            {game.status === GameStatus.UPCOMING ? (
              <div>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => showInviteText(game, username, player)}
                >
                  Näytä kutsuteksti
                </Button>
              </div>
            ) : (
              <Typography>{`${player.points} pistettä`}</Typography>
            )}
          </div>
        ))}
      </div>
      {inviteText && (
        <div className={classes.inviteText}>
          <Typography variant="h6" gutterBottom>
            Kutsuteksti
          </Typography>
          <Typography style={{ whiteSpace: 'pre' }}>{inviteText}</Typography>
        </div>
      )}
    </Paper>
  );
};

export default QueuedGame;
