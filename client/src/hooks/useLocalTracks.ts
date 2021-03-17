import React from 'react';
import {
  createLocalTracks,
  LocalVideoTrack,
  LocalAudioTrack,
  LocalTrack,
} from 'twilio-video';

import logger from '../utils/logger';

interface LocalTracks {
  localVideoTrack: LocalVideoTrack | null;
  localAudioTrack: LocalAudioTrack | null;
  error: string | null;
}

const useLocalTracks = (onCall: boolean): LocalTracks => {
  const [localTracks, setLocalTracks] = React.useState<null | LocalTrack[]>(
    null
  );
  const [error, setError] = React.useState<null | string>(null);

  React.useEffect(() => {
    const getLocalTracks = async () => {
      logger.log('getting local media tracks');

      const tracks = await createLocalTracks();

      setLocalTracks(tracks);
    };

    if (onCall && !localTracks) {
      try {
        getLocalTracks();
      } catch (error) {
        logger.error(`error getting tracks: ${error.message}`);

        setError(`error getting tracks: ${error.message}`);
      }
    }

    return () => {
      if (localTracks) {
        logger.log('shutting off local tracks');

        localTracks.forEach((track) => {
          if (track.kind === 'video' || track.kind === 'audio') {
            track.stop();
          }
        });
      }
    };
  }, [onCall, localTracks]);

  return {
    localVideoTrack:
      (localTracks?.find(
        (track) => track.kind === 'video'
      ) as LocalVideoTrack) ?? null,
    localAudioTrack:
      (localTracks?.find(
        (track) => track.kind === 'audio'
      ) as LocalAudioTrack) ?? null,
    error,
  };
};

export default useLocalTracks;
