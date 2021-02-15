import React from 'react';

import { RTCGame } from '../types';
import { Participant } from 'twilio-video';

/** Returns game players and host as a map with id:s as keys, Twilio.Participants as values */
const useInitialParticipants = (game: RTCGame | null) => {
  const [
    initialParticipants,
    setInitialParticipants,
  ] = React.useState<null | Map<string, Participant | null>>(null);

  React.useEffect(() => {
    if (!initialParticipants && game) {
      const initials = new Map();

      game.players.forEach((player) => initials.set(player.id, null));

      initials.set(game.host.id, null);

      setInitialParticipants(initials);
    }
  }, [game, initialParticipants]);

  return initialParticipants;
};

export default useInitialParticipants;
