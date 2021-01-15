import React from 'react';

import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router-dom';
import gameService from '../services/games';

import { LobbyGame } from '../types';
import logger from '../utils/logger';

interface ParamTypes {
  username: string;
  gameID: string;
}

const useLobbySystem = () => {
  const { username, gameID } = useParams<ParamTypes>();
  const reservationId = React.useMemo(() => uuidv4(), []);
  const [error, setError] = React.useState<string | null>(null);
  const [game, setGame] = React.useState<LobbyGame | null>(null);

  React.useEffect(() => {
    const fetchGame = async (host: string, id: string) => {
      try {
        const fetchedGame = await gameService.getLobbyGame(host, id);

        logger.log('setting game', fetchedGame);

        setGame(fetchedGame);
      } catch (e) {
        setError('Peliä ei löytynyt, tarkista osoite!');
      }
    };

    if (!game && gameID && username) {
      fetchGame(username, gameID);
    }
  }, [gameID, game, username]);

  const lockSpot = React.useCallback(
    async (displayName: string, email: string) => {
      if (!reservationId || !gameID || !game) {
        return;
      }

      try {
        const lockedPlayerData = await gameService.lockSpotForGame(
          reservationId,
          gameID,
          displayName,
          email
        );

        logger.log('got locked player', lockedPlayerData);

        const newGame = {
          ...game,
          players: game.players.map((player) => {
            return player && player.id === lockedPlayerData.id
              ? {
                  ...player,
                  name: lockedPlayerData.name,
                  lockedForMe: true,
                  locked: true,
                  words: lockedPlayerData.data.words,
                  url: `https://www.kotipelit.com/${username}/${lockedPlayerData.inviteCode}`,
                }
              : player;
          }),
        };

        logger.log('setting new game', newGame);

        setGame(newGame);
      } catch (e) {
        setError(
          'Paikan lukitseminen epäonnistui. Varmista, että kirjoitit sähköpostisi oikein.'
        );
      }
    },
    [reservationId, gameID, game, username]
  );

  const reserveSpot = React.useCallback(async () => {
    if (!reservationId || !gameID || !game) {
      return;
    }

    try {
      const reservationData = await gameService.reserveSpotForGame(
        reservationId,
        gameID
      );

      const newGame = {
        ...game,
        players: game.players.map((player) => {
          return player && player.id === reservationData.playerId
            ? {
                ...player,
                expires: reservationData.expiresAt,
                reservedForMe: true,
              }
            : player;
        }),
      };

      logger.log('setting new game', newGame);

      setGame(newGame);
    } catch (e) {
      setError('Paikan varaaminen epäonnistui');
    }
  }, [reservationId, gameID, game]);

  const returnValue = React.useMemo(() => {
    return {
      game,
      error,
      reserveSpot,
      lockSpot,
    };
  }, [game, error, reserveSpot, lockSpot]);

  return returnValue;
};

export default useLobbySystem;
