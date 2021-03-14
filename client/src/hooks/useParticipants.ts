import React from 'react';
import { RTCParticipant } from '../types';

import useInitialParticipants from './useInitialParticipants';

const useParticipants = (
  isSpectator: boolean
): [
  RTCParticipant[] | null,
  React.Dispatch<React.SetStateAction<RTCParticipant[] | null>>
] => {
  const initialParticipants = useInitialParticipants(isSpectator);

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
