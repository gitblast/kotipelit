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
  Popover,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ClearIcon from '@material-ui/icons/Clear';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
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
    cardStyle: {
      width: 400,
      margin: theme.spacing(2),
      // Ligth version of background
      backgroundColor: 'rgb(15 47 60)',
      color: theme.palette.primary.light,
      border: 'solid rgb(0 225 217)',
      [theme.breakpoints.down('sm')]: {
        margin: theme.spacing(0.7),
      },
    },
    avatarStyle: {
      background: theme.palette.secondary.main,
    },
    playerRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    helpIcon: {
      // caption color
      color: 'rgb(135 135 135)',
      marginLeft: theme.spacing(0.5),
      fontSize: 19,
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
    popover: {
      pointerEvents: 'none',
    },
    paper: {
      padding: theme.spacing(1),
      maxWidth: 300,
    },
  })
);

interface QueuedGameProps {
  game: RTCGame;
  username: string;
}

const InviteLink = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <span>
      <IconButton
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        size="small"
        edge="end"
      >
        <HelpOutlineIcon className={classes.helpIcon}></HelpOutlineIcon>
      </IconButton>

      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography variant="body2">
          Pelaajat saa sähköpostiinsa linkin, jolla pääsevät peliin. Jos
          ylläoleva pelaaja hukkaa linkkinsä, jaa tämä hänelle.
        </Typography>
      </Popover>
    </span>
  );
};

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
        <>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to={`/${username}/kutsut/${game.id}`}
          >
            Peliaula
          </Button>
          <IconButton className={classes.actionIcon} aria-label="copy">
            {/* This should copy output of getLobbyLink() */}
            <FileCopyIcon />
          </IconButton>
        </>
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
          title={<Typography variant="h3">{capitalize(game.type)}</Typography>}
          subheader={
            <Typography variant="body1">
              {format(new Date(game.startTime), 'd. MMMM HH:mm', {
                locale: fiLocale,
              })}{' '}
            </Typography>
          }
        />
        <CardContent>
          {game.players.map((player) => (
            <div key={player.id}>
              <div className={classes.playerRow}>
                <div>
                  <Typography variant="body1" color="initial">
                    {player.name}
                  </Typography>
                </div>
                <Typography variant="body2">
                  {player.privateData.words.join(', ')}
                </Typography>
                {game.status !== GameStatus.FINISHED ? (
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

              <Typography variant="caption">{`${
                // eslint-disable-next-line no-undef
                process?.env.NODE_ENV === 'development'
                  ? 'http://localhost:3000'
                  : 'https://www.kotipelit.com'
              }/${username}/${player.privateData.inviteCode}`}</Typography>
              <InviteLink />
            </div>
          ))}
        </CardContent>
        <CardActions disableSpacing className={classes.actions}>
          <div>{lobbyButton()}</div>

          {startRTCButton()}
        </CardActions>
      </Card>
    </>
  );
};

export default QueuedGame;
