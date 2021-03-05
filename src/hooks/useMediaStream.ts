import React from 'react';

import logger from '../utils/logger';

export const useMediaStream = (
  showVideo: boolean,
  constraints: MediaStreamConstraints
): [MediaStream | null, string | null] => {
  const [stream, setStream] = React.useState<MediaStream | null>(null);
  const [error, setError] = React.useState<null | string>(null);

  React.useEffect(() => {
    const getUserMedia = async () => {
      logger.log(`getting user media`);
      try {
        const localStream = await navigator.mediaDevices.getUserMedia(
          constraints
        );

        setStream(localStream);
      } catch (e) {
        logger.error(`error getting user media: ${e.message}`);
        setError(e.message);
      }
    };

    if (!stream && showVideo) {
      getUserMedia();
    } else {
      return () => {
        if (stream) {
          logger.log(`shutting off local stream`);
          stream.getTracks().forEach((track) => track.stop());
        }
      };
    }
  }, [stream, showVideo, constraints]);

  const returnedTuple: [
    MediaStream | null,
    string | null
  ] = React.useMemo(() => [stream, error], [stream, error]);

  return returnedTuple;
};

export default useMediaStream;
