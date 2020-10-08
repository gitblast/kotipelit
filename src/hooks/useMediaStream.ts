import React from 'react';

import { log } from '../utils/logger';

// const log = (msg: unknown) => console.log(msg);

export const useMediaStream = (
  showVideo: boolean,
  constraints: MediaStreamConstraints
): [MediaStream | null, string | null] => {
  const [stream, setStream] = React.useState<MediaStream | null>(null);
  const [error, setError] = React.useState<null | string>(null);

  React.useEffect(() => {
    const getUserMedia = async () => {
      log(`getting user media`);
      try {
        const localStream = await navigator.mediaDevices.getUserMedia(
          constraints
        );

        setStream(localStream);
      } catch (e) {
        log(`error getting user media: ${e.message}`);
        setError(e.message);
      }
    };

    if (!stream && showVideo) {
      getUserMedia();
    } else {
      return () => {
        if (stream) {
          log(`shutting off local stream`);
          stream.getTracks().forEach((track) => track.stop());
        }
      };
    }
  }, [stream, showVideo]);

  return [stream, error];
};

export default useMediaStream;
