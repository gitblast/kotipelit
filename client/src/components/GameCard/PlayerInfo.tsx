import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Typography, IconButton } from '@material-ui/core';
import { GameStatus, RTCKotitonniPlayer } from '../../types';

import logger from '../../utils/logger';
import gameService from '../../services/games';

import ClearIcon from '@material-ui/icons/Clear';
import PlayerInfoTooltip from './PlayerInfoTooltip';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    playerRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    actionIcon: {
      padding: theme.spacing(0.5),
      color: theme.palette.primary.light,
    },
  })
);

interface PlayerInfoProps {
  player: RTCKotitonniPlayer;
  gameStatus: GameStatus;
  hostName: string;
}

const PlayerInfo = ({ player, gameStatus, hostName }: PlayerInfoProps) => {
  const classes = useStyles();

  const handleCancel = async (inviteCode: string) => {
    const agree = window.confirm('Perutaanko varaus?');

    if (!agree) return;

    const success = await gameService.cancelReservation(hostName, inviteCode);

    if (success) {
      logger.log('cancel succesful');

      console.log('todo: update ui');
    } else {
      logger.log('cancel failed');
    }
  };

  return (
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
        {gameStatus !== GameStatus.FINISHED ? (
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
      }/${hostName}/${player.privateData.inviteCode}`}</Typography>
      <PlayerInfoTooltip />
    </div>
  );
};

export default PlayerInfo;
