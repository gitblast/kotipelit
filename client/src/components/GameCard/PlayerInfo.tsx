import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Typography, IconButton } from '@material-ui/core';
import { GameStatus, RTCKotitonniPlayer } from '../../types';

import logger from '../../utils/logger';
import gameService from '../../services/games';

import ClearIcon from '@material-ui/icons/Clear';
import InfoTooltip from './InfoTooltip';
import { useGames } from '../../context';

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
  gameId: string;
}

const PlayerInfo = ({
  player,
  gameStatus,
  hostName,
  gameId,
}: PlayerInfoProps) => {
  const classes = useStyles();

  const { setGames } = useGames();

  const handleCancel = async (inviteCode: string) => {
    const agree = window.confirm('Perutaanko varaus?');

    if (!agree) return;

    try {
      await gameService.cancelReservation(hostName, inviteCode);

      logger.log('cancel succesful');

      const updatedGame = await gameService.getGame(gameId);

      setGames((currentGames) =>
        currentGames.map((game) => (game.id === gameId ? updatedGame : game))
      );
    } catch (error) {
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
            disabled={gameStatus !== GameStatus.UPCOMING}
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
      <InfoTooltip
        text={
          'Pelaajat saavat sähköpostiinsa linkin, jolla pääsevät peliin. Jos ylläoleva pelaaja hukkaa linkkinsä, jaa tämä hänelle.'
        }
      />
    </div>
  );
};

export default PlayerInfo;
