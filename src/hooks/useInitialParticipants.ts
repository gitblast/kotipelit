import React from 'react';

import { RTCGame, RTCParticipant } from '../types';

const useInitialParticipants = (game: RTCGame | null, ownId: string | null) => {
  const [initialParticipants, setInitialParticipants] = React.useState<
    null | RTCParticipant[]
  >(null);

  React.useEffect(() => {
    if (!initialParticipants && game && ownId) {
      const hostParticipant = {
        id: game.host.id,
        isHost: true,
        connection: null,
        isMe: ownId === game.host.id,
      };

      const initials = game.players
        .map((player) => {
          return {
            id: player.id,
            isHost: false,
            connection: null,
            isMe: ownId === player.id,
          };
        })
        .concat(hostParticipant);

      setInitialParticipants(initials);
    }
  }, [game, initialParticipants, ownId]);

  return initialParticipants;
};

export default useInitialParticipants;
