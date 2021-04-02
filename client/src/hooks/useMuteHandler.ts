import { LocalAudioTrackPublication } from 'twilio-video';
import { useMediaMutedStates } from '../context';
import React from 'react';

/** disables/enables local audio tracks when muted/unmuted */
const useMuteHandler = (
  tracks: Map<string, LocalAudioTrackPublication> | null,
  ownId: string | null
) => {
  const { mutedMap } = useMediaMutedStates();

  const selfIsMuted = React.useMemo(() => {
    if (!ownId) {
      return null;
    }

    return mutedMap[ownId];
  }, [mutedMap, ownId]);

  React.useEffect(() => {
    if (tracks && selfIsMuted !== null) {
      tracks.forEach((publication) => {
        const { track } = publication;

        if (!track) {
          return;
        }

        if (track.kind === 'audio') {
          if (selfIsMuted) {
            track.isEnabled && track.disable();
          } else {
            !track.isEnabled && track.enable();
          }
        }
      });
    }
  }, [selfIsMuted, tracks]);
};

export default useMuteHandler;
