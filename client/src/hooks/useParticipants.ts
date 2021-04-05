import React from 'react';
import { RTCParticipant, RTCGame } from '../types';

import useInitialParticipants from './useInitialParticipants';
import logger from '../utils/logger';

const useParticipants = (
  game: RTCGame | null,
  ownId: string | null,
  isSpectator: boolean
): [
  RTCParticipant[] | null,
  React.Dispatch<React.SetStateAction<RTCParticipant[] | null>>
] => {
  const initialParticipants = useInitialParticipants(game, ownId, isSpectator);

  const [participants, setParticipants] = React.useState<
    RTCParticipant[] | null
  >(null);

  React.useEffect(() => {
    if (initialParticipants && !participants) {
      setParticipants(initialParticipants);
    }
  }, [participants, initialParticipants]);

  // fixes participant order if different than on server
  React.useEffect(() => {
    if (game && participants) {
      try {
        const orderIsCorrect = game.players.every((player, index) => {
          return player.id === participants[index].id;
        });

        if (!orderIsCorrect) {
          logger.log('fixing participant order');

          const hostParticipant = participants.find(
            (p) => p.id === game.host.id
          );

          if (!hostParticipant) {
            throw new Error(
              `unexpected error: no participant found matching host`
            );
          }

          const newPlayers = game.players.map((player) => {
            const matching = participants.find((p) => p.id === player.id);

            if (!matching) {
              throw new Error(
                `unexpected error: no participant found matching player with id '${player.id}'`
              );
            }

            return matching;
          });

          const newParticipants = newPlayers.concat(hostParticipant);

          setParticipants(newParticipants);
        }
      } catch (error) {
        logger.error(
          `something went wrong checking player order: ${error.message}`
        );
      }
    }
  }, [game, participants]);

  return [participants, setParticipants];
};

export default useParticipants;
