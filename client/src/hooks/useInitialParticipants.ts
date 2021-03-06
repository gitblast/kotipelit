import React from 'react';
import { useSelector } from 'react-redux';

import { RTCParticipant, State } from '../types';

const useInitialParticipants = () => {
  const game = useSelector((state: State) => state.rtc.game);
  const ownId = useSelector((state: State) => state.rtc.self?.id ?? null);
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
        displayName: game.host.displayName,
      };

      const initials = game.players
        .map((player) => {
          return {
            id: player.id,
            isHost: false,
            connection: null,
            isMe: ownId === player.id,
            displayName: player.name,
          };
        })
        .concat(hostParticipant);

      setInitialParticipants(initials);
    }
  }, [game, initialParticipants, ownId]);

  return initialParticipants;
};

export default useInitialParticipants;