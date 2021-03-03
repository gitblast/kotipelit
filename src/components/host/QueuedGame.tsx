import React from 'react';

import { capitalize } from 'lodash';
import gameService from '../../services/games';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  Button,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Card,
  CardHeader,
  CardContent,
  CardActions,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ClearIcon from '@material-ui/icons/Clear';
// Enable when possible to share on social media
// import ShareIcon from '@material-ui/icons/Share';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { GameStatus, RTCGame } from '../../types';
import { useDispatch } from 'react-redux';
import { deleteGame } from '../../reducers/games.reducer';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import fiLocale from 'date-fns/locale/fi';
import logger from '../../utils/logger';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginTop: theme.spacing(1),
      padding: theme.spacing(2),
    },
    cardStyle: {
      width: 400,
      margin: theme.spacing(2),
      // Ligth version of background
      backgroundColor: 'rgb(15 47 60)',
      color: theme.palette.primary.light,
      border: 'solid rgb(0 225 217)',
    },
    avatarStyle: {
      background: theme.palette.secondary.main,
    },
    cardHeaders: {
      color: theme.palette.secondary.light,
    },
    playerRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing(1),
    },
    actions: {
      display: 'flex',
      justifyContent: 'space-between',
      marginRight: theme.spacing(1),
    },
    actionIcon: {
      padding: theme.spacing(0.5),
      color: theme.palette.primary.light,
    },

    inviteText: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  })
);

interface QueuedGameProps {
  game: RTCGame;
  username: string;
}

const QueuedGame: React.FC<QueuedGameProps> = ({ game, username }) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const dispatch = useDispatch();

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => setAnchorEl(null);

  const handleRemove = (): void => {
    const agree = window.confirm('Poistetaanko peli?');

    if (agree) dispatch(deleteGame(game.id));
  };

  const startRTCButton = () => {
    if (game.status !== GameStatus.FINISHED) {
      const label = game.status === GameStatus.UPCOMING ? 'Käynnistä' : 'Liity';

      const isOver30MinAway =
        new Date(game.startTime).getTime() - new Date().getTime() >
        30 * 60 * 1000;

      return (
        <Button
          disabled={isOver30MinAway}
          variant="contained"
          color="secondary"
          component={Link}
          to={`/${username}/pelit/${game.id}`}
        >
          {label}
        </Button>
      );
    }
  };

  const lobbyButton = () => {
    if (game.status !== GameStatus.FINISHED) {
      return (
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to={`/${username}/kutsut/${game.id}`}
        >
          Peliaula
        </Button>
      );
    }
  };

  const handleCancel = async (inviteCode?: string) => {
    if (!inviteCode) {
      return logger.log('inviteCode missing!');
    }

    const agree = window.confirm('Perutaanko varaus?');

    if (!agree) return;

    const success = await gameService.cancelReservation(username, inviteCode);

    if (success) {
      logger.log('cancel succesful');

      console.log('todo: update ui');
    } else {
      logger.log('cancel failed');
    }
  };

  // const getLobbyLink = () => {
  //   const host =
  //     // eslint-disable-next-line no-undef
  //     process && process.env.NODE_ENV === 'development'
  //       ? 'http://localhost:3000'
  //       : 'https://www.kotipelit.com';

  //   return `${host}/${username}/kutsut/${game.id}`;
  // };

  return (
    <>
      <Card elevation={2} className={classes.cardStyle}>
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
          title={
            <Typography variant="h3" className={classes.cardHeaders}>
              {capitalize(game.type)}
            </Typography>
          }
          subheader={
            <Typography variant="body1" className={classes.cardHeaders}>
              {format(new Date(game.startTime), 'd. MMMM HH:mm', {
                locale: fiLocale,
              })}{' '}
            </Typography>
          }
        />
        <CardContent>
          {game.players.map((player) => (
            <div key={player.id} className={classes.playerRow}>
              <div>
                <Typography variant="body1" color="initial">
                  {player.name}
                </Typography>
              </div>
              <Typography variant="body2">
                {player
                  ? player.privateData.words.join(', ')
                  : '<Pelaajan sanat>'}
              </Typography>
              {/* Displaying points only after gamestatus finished. Atm games dont get finished */}
              {game.status !== GameStatus.FINISHED ? (
                // <Button
                //   variant="outlined"
                //   color="primary"
                //   size="small"
                //   onClick={() => showInviteText(game, username, player)}
                // >
                //   Kutsu
                // </Button>
                <IconButton
                  className={classes.actionIcon}
                  onClick={() => handleCancel(player.privateData.inviteCode)}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              ) : (
                <Typography component="div">{player.points}</Typography>
              )}
            </div>
          ))}
          {/* {inviteText && (
            <div className={classes.inviteText}>
              <Typography variant="h5" gutterBottom>
                Lähetä pelaajalle alla oleva kutsuteksti.
              </Typography>
              <Typography style={{ whiteSpace: 'pre' }}>
                {inviteText}
              </Typography>
            </div>
          )} */}
        </CardContent>
        <CardActions disableSpacing className={classes.actions}>
          <div>
            {lobbyButton()}
            <IconButton className={classes.actionIcon} aria-label="copy">
              {/* This should copy output of getLobbyLink() */}
              <FileCopyIcon />
            </IconButton>
            {/* For sharing gameLobby page in social medias */}
            {/* <IconButton className={classes.actionIcon} aria-label="share">
              <ShareIcon />
            </IconButton> */}
          </div>

          {startRTCButton()}
        </CardActions>
      </Card>
      {/* <Paper elevation={2} className={classes.container}>
        <div className={`${classes.infoBar} ${classes.flex}`}>
          <div>
            <Typography>
              {format(new Date(game.startTime), 'd. MMMM HH:mm', {
                locale: fiLocale,
              })}
            </Typography>
          </div>
          <div>
            <Typography>{capitalize(game.type)}</Typography>
          </div>
          <div>
            <Typography>{`${game.players.length} pelaajaa`}</Typography>
          </div>

          <div>
            {startRTCButton()}
            {startButton()}
            <IconButton
              size="small"
              className={classes.editButton}
              onClick={handleOpen}
            >
              <MoreVertIcon />
            </IconButton>
          </div>
        </div>
        {game.status === GameStatus.UPCOMING && (
          <div>
            <Typography variant="h6" gutterBottom>
              Aulalinkki
            </Typography>
            <Typography>{getLobbyLink()}</Typography>
          </div>
        )}
        <div>
          <Typography variant="h6" gutterBottom>
            Pelaajat
          </Typography>
          {game.players.map((player) => (
            <div key={player.id}>
              <Typography component="div">{player.name}</Typography>
              <Typography component="div">
                {game.status !== GameStatus.UPCOMING &&
                  `${player.points} pistettä`}
              </Typography>
              <Typography component="div">
                {player.words.join(' / ')}
              </Typography>
              <div>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => showInviteText(game, username, player)}
                >
                  Näytä kutsuteksti
                </Button>
              </div>
            </div>
          ))}
        </div>
        {inviteText && (
          <div className={classes.inviteText}>
            <Typography variant="h6" gutterBottom>
              Lähetä pelaajalle alla oleva kutsuteksti.
            </Typography>
            <Typography style={{ whiteSpace: 'pre' }}>{inviteText}</Typography>
          </div>
        )}
      </Paper> */}
    </>
  );
};

export default QueuedGame;
