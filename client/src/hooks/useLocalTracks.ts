import React from 'react';
import {
  createLocalTracks,
  LocalVideoTrack,
  LocalAudioTrack,
  LocalTrack,
  CreateLocalTracksOptions,
} from 'twilio-video';

import useDevices from './useDevices';

import {
  DEFAULT_VIDEO_CONSTRAINTS,
  DEFAULT_AUDIO_CONSTRAINTS,
  SAVED_AUDIO_DEVICE_ID,
  SAVED_VIDEO_DEVICE_ID,
} from '../constants';

import logger from '../utils/logger';

interface LocalTracks {
  localVideoTrack: LocalVideoTrack | null;
  localAudioTrack: LocalAudioTrack | null;
  shutDownLocalTracks: () => void;
  error: string | null;
}

const useLocalTracks = (onCall: boolean): LocalTracks => {
  const [localTracks, setLocalTracks] = React.useState<null | LocalTrack[]>(
    null
  );
  const [error, setError] = React.useState<null | string>(null);
  const { audioInputDevices, videoInputDevices } = useDevices();

  React.useEffect(() => {
    const getLocalTracks = async () => {
      logger.log('getting local media tracks');

      const preferredAudioInput = window.localStorage.getItem(
        SAVED_AUDIO_DEVICE_ID
      );
      const preferredVideoInput = window.localStorage.getItem(
        SAVED_VIDEO_DEVICE_ID
      );

      const preferredAudioExists =
        preferredAudioInput &&
        audioInputDevices?.some(
          (device) => device.deviceId === preferredAudioInput
        );

      const preferredVideoExists =
        !!preferredVideoInput &&
        !!videoInputDevices?.some(
          (device) => device.deviceId === preferredVideoInput
        );

      const options: CreateLocalTracksOptions = {
        video: {
          ...DEFAULT_VIDEO_CONSTRAINTS,
          ...(preferredVideoInput &&
            preferredVideoExists && {
              deviceId: { exact: preferredVideoInput },
            }),
        },
        audio: {
          ...DEFAULT_AUDIO_CONSTRAINTS,
          ...(preferredAudioInput &&
            preferredAudioExists && {
              deviceId: { exact: preferredAudioInput },
            }),
        },
      };

      const tracks = await createLocalTracks(options);

      setLocalTracks(tracks);
    };

    if (onCall && audioInputDevices && videoInputDevices && !localTracks) {
      try {
        getLocalTracks();
      } catch (error) {
        logger.error(`error getting tracks: ${error.message}`);

        setError(`error getting tracks: ${error.message}`);
      }
    }
  }, [onCall, localTracks, audioInputDevices, videoInputDevices]);

  const shutDownLocalTracks = React.useCallback(() => {
    if (localTracks) {
      logger.log('shutting down local tracks');
    }

    localTracks?.forEach((track) => {
      if (track.kind === 'audio' || track.kind === 'video') {
        track.stop();
      }
    });
  }, [localTracks]);

  return {
    localVideoTrack:
      (localTracks?.find(
        (track) => track.kind === 'video'
      ) as LocalVideoTrack) ?? null,
    localAudioTrack:
      (localTracks?.find(
        (track) => track.kind === 'audio'
      ) as LocalAudioTrack) ?? null,
    shutDownLocalTracks,
    error,
  };
};

export default useLocalTracks;
