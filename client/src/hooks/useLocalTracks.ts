import React from 'react';
import { createLocalTracks, LocalTrack } from 'twilio-video';

import logger from '../utils/logger';

const useLocalTracks = (
  onCall: boolean
): [null | LocalTrack[], null | string] => {
  const [localTracks, setLocalTracks] = React.useState<null | LocalTrack[]>(
    null
  );
  const [error, setError] = React.useState<null | string>(null);

  React.useEffect(() => {
    const getLocalTracks = async () => {
      const tracks = await createLocalTracks();

      logger.log('getting local media tracks');

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
  }, [onCall, localTracks]);

  return [localTracks, error];
};

export default useLocalTracks;
