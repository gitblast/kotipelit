import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  const { username, gameID } = useParams<ParamTypes>();
  const reservationId = React.useMemo(() => uuidv4(), []);
  const [error, setError] = React.useState<string | null>(null);
  const [game, setGame] = React.useState<LobbyGame | null>(null);

  React.useEffect(() => {
    const fetchGame = async (host: string, id: string) => {
      try {
        const fetchedGame = await gameService.getLobbyGame(host, id);

        logger.log('setting game', fetchedGame);

        const mySavedReservation = window.localStorage.getItem(
          `kotitonniReservation-gameID-${gameID}`
        );

        if (mySavedReservation) {
          logger.log('existing reservation found!');

          const myLockedPlayerData = JSON.parse(mySavedReservation);

          let reservationIdMatches = false;

          setGame({
            ...fetchedGame,
            players: fetchedGame.players.map((player) => {
              if (
                player.id === myLockedPlayerData.id &&
                player.reservedFor?.id === myLockedPlayerData.reservedFor.id
              ) {
                reservationIdMatches = true;

                return {
                  ...player,
                  name: myLockedPlayerData.name,
                  lockedForMe: true,
                  locked: true,
                  email: myLockedPlayerData.email,
                  privateData: myLockedPlayerData.privateData,
                  url: `https://www.kotipelit.com/${username}/${myLockedPlayerData.privateData.inviteCode}`,
                };
              }

              return player;
            }),
          });

          if (!reservationIdMatches) {
            // reservation has been cancelled
            logger.log(
              'reservation id does not match! removing reservation data from local storage'
            );

            window.localStorage.removeItem(
              `kotitonniReservation-gameID-${gameID}`
            );
          }
        } else {
          setGame(fetchedGame);
        }
      } catch (e) {
        setError(t('lobby.errors.registrationEnded'));
      }
    };

    if (!game && gameID && username) {
      fetchGame(username, gameID);
    }
  }, [gameID, game, username, t]);

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

        window.localStorage.setItem(
          `kotitonniReservation-gameID-${gameID}`,
          JSON.stringify({
            ...lockedPlayerData,
            email,
            reservationId,
          })
        );

        logger.log('got locked player', lockedPlayerData);

        const newGame = {
          ...game,
          players: game.players.map((player) => {
            return player?.id === lockedPlayerData.id
              ? {
                  ...player,
                  name: lockedPlayerData.name,
                  lockedForMe: true,
                  reservedFor: {
                    id: reservationId,
                    expires: 0,
                    locked: true,
                  },
                  email,
                  privateData: lockedPlayerData.privateData,
                  url: `https://www.kotipelit.com/${username}/${lockedPlayerData.privateData.inviteCode}`,
                }
              : player;
          }),
        };

        logger.log('setting new game', newGame);

        setGame(newGame);
      } catch (e) {
        setError(t('lobby.errors.lockingFailed'));
      }
    },
    [reservationId, gameID, game, username, t]
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
                reservedFor: {
                  id: reservationId,
                  expires: reservationData.expiresAt,
                  locked: false,
                },
                reservedForMe: true,
              }
            : player;
        }),
      };

      logger.log('setting new game', newGame);

      setGame(newGame);
    } catch (e) {
      setError(t('lobby.errors.reservationFailed'));
    }
  }, [reservationId, gameID, game, t]);

  const returnValue = React.useMemo(() => {
    return {
      game,
      error,
      reserveSpot,
      lockSpot,
      unlockedReservationData:
        game?.players.find((player) => player.reservedForMe) ?? null,
      lockedReservationData:
        game?.players.find((player) => player.lockedForMe) ?? null,
    };
  }, [game, error, reserveSpot, lockSpot]);

  return returnValue;
};

export default useLobbySystem;
