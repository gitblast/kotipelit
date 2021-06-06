import { useEffect, useState } from 'react';
import { Participant } from 'twilio-video';

const useParticipantNetworkQualityLevel = (participant: Participant | null) => {
  const [networkQualityLevel, setNetworkQualityLevel] = useState<number | null>(
    participant?.networkQualityLevel ?? null
  );

  useEffect(() => {
    const handleNewtorkQualityLevelChange = (newNetworkQualityLevel: number) =>
      setNetworkQualityLevel(newNetworkQualityLevel);

    if (participant) {
      setNetworkQualityLevel(participant.networkQualityLevel);

      participant.on(
        'networkQualityLevelChanged',
        handleNewtorkQualityLevelChange
      );
      return () => {
        participant.off(
          'networkQualityLevelChanged',
          handleNewtorkQualityLevelChange
        );
      };
    }
  }, [participant]);

  return networkQualityLevel;
};

export default useParticipantNetworkQualityLevel;
