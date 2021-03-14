import React from 'react';
import { createLocalTracks, LocalTrack } from 'twilio-video';

import logger from '../utils/logger';

const useLocalTracks = (
  onCall: boolean,
  isSpectator: boolean
): [null | LocalTrack[], null | string] => {
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

    if (!isSpectator && onCall && !localTracks) {
      try {
        getLocalTracks();
      } catch (error) {
        logger.error(`error getting tracks: ${error.message}`);

        setError(`error getting tracks: ${error.message}`);
      }
    }

    if (isSpectator && onCall) {
      logger.log('not getting local media tracks (spectator)');
    }
  }, [onCall, localTracks, isSpectator]);

  return [localTracks, error];
};

export default useLocalTracks;
