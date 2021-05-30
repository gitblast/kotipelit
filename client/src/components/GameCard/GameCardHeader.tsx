import {
  Avatar,
  capitalize,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { format } from 'date-fns';
import fiLocale from 'date-fns/locale/fi';
import enLocale from 'date-fns/locale/en-US';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGames } from '../../context';
import { RTCGame } from '../../types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatarStyle: {
      background: 'linear-gradient(to right, rgb(189 17 198), transparent)',
    },
  })
);

interface GameCardHeaderProps {
  game: RTCGame;
}

const GameCardHeader = ({ game }: GameCardHeaderProps) => {
  const classes = useStyles();

  const { t, i18n } = useTranslation();

  const { deleteGame } = useGames();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleRemove = (): void => {
    const agree = window.confirm('Poistetaanko peli?');

    if (agree) deleteGame(game.id);
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
            {/* <MenuItem disabled>
              <Typography>Muokkaa</Typography>
            </MenuItem> */}
            <MenuItem onClick={handleRemove}>
              <Typography variant="body1" color="error">
                {t('gameCard.removeGame')}
              </Typography>
            </MenuItem>
          </Menu>
        </>
      }
      title={<Typography variant="h3">{capitalize(game.type)}</Typography>}
      subheader={
        <Typography variant="body1">
          {format(new Date(game.startTime), 'd. MMMM HH:mm', {
            locale: i18n.language === 'en' ? enLocale : fiLocale,
          })}{' '}
        </Typography>
      }
    />
  );
};

export default GameCardHeader;
