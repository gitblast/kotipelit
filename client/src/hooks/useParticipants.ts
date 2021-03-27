import React from 'react';
import { RTCParticipant, RTCGame } from '../types';

import useInitialParticipants from './useInitialParticipants';

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

  return [participants, setParticipants];
};

export default useParticipants;
