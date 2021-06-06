import React from 'react';
import {
  AudioTrack,
  LocalAudioTrack,
  LocalParticipant,
  LocalVideoTrack,
  RemoteAudioTrack,
  RemoteParticipant,
  RemoteTrack,
  RemoteVideoTrack,
  VideoTrack,
} from 'twilio-video';
import { RTCParticipant } from '../types';
import logger from '../utils/logger';
import { useMediaMutedStates } from '../context';

type LocalVideoSetter = (track: LocalVideoTrack) => void;
type LocalAudioSetter = (track: LocalAudioTrack) => void;

const attachSubscribeListeners = (participant: RemoteParticipant) => {
  participant.tracks.forEach((publication) => {
    publication.on('subscribed', (track) => {
      logger.log(`subscribed to track ${track.sid} (${track.kind}))`);
    });

    publication.on('unsubscribed', (track) => {
      logger.log(`unsubscribed to track ${track.sid} (${track.kind}))`);
    });

    publication.on('subscriptionFailed', (error) => {
      logger.log(
        `failed to subscribe to track ${publication.trackSid}:`,
        error
      );
    });
  });
};

const useParticipantLocalTracks = (
  videoSet: boolean,
  audioSet: boolean,
  localParticipant: LocalParticipant | null,
  setVideoTrack: LocalVideoSetter,
  setAudioTrack: LocalAudioSetter,
  handleMute: (muted: boolean) => void
) => {
  React.useEffect(() => {
    if (localParticipant && !videoSet) {
      const { videoTracks } = localParticipant;

      const videoTrack = Array.from(videoTracks.values())[0].track;

      logger.log('setting local video', videoTrack);

      setVideoTrack(videoTrack);
    }
  }, [localParticipant, setVideoTrack, videoSet]);

  React.useEffect(() => {
    if (localParticipant && !audioSet) {
      const { audioTracks } = localParticipant;

      const audioTrack = Array.from(audioTracks.values())[0].track;

      logger.log('setting local audio', audioTrack);

      audioTrack.on('disabled', () => handleMute(true));
      audioTrack.on('enabled', () => handleMute(false));

      setAudioTrack(audioTrack);
    }
  }, [localParticipant, setAudioTrack, audioSet, handleMute]);
};

const useParticipantRemoteTracks = (
  videoSet: boolean,
  audioSet: boolean,
  remoteParticipant: RemoteParticipant | null,
  setVideoTrack: (track: RemoteVideoTrack) => void,
  setAudioTrack: (track: RemoteAudioTrack) => void,
  handleMute: (muted: boolean) => void
) => {
  React.useEffect(() => {
    if (remoteParticipant && !videoSet) {
      attachSubscribeListeners(remoteParticipant);

      const videoPublication = Array.from(
        remoteParticipant.videoTracks.values()
      )[0];

      if (videoPublication?.isSubscribed && videoPublication.track) {
        logger.log(
          'setting (already subscribed) remote video',
          videoPublication.track
        );

        setVideoTrack(videoPublication.track);
      }

      remoteParticipant.on('trackSubscribed', (track: RemoteTrack) => {
        if (track.kind === 'video') {
          logger.log('setting remote video', track);

          setVideoTrack(track);
        }
      });
    }
  }, [remoteParticipant, setVideoTrack, videoSet]);

  React.useEffect(() => {
    if (remoteParticipant && !audioSet) {
      attachSubscribeListeners(remoteParticipant);

      const audioPublication = Array.from(
        remoteParticipant.audioTracks.values()
      )[0];

      if (audioPublication?.isSubscribed && audioPublication.track) {
        logger.log(
          'setting (already subscribed) remote audio',
          audioPublication.track
        );

        audioPublication.track.on('disabled', () => handleMute(true));
        audioPublication.track.on('enabled', () => handleMute(false));

        setAudioTrack(audioPublication.track);
      }

      remoteParticipant.on('trackSubscribed', (track: RemoteTrack) => {
        if (track.kind === 'audio') {
          logger.log('setting remote audio', track);

          track.on('disabled', () => handleMute(true));
          track.on('enabled', () => handleMute(false));

          setAudioTrack(track);
        }
      });
    }
  }, [remoteParticipant, setAudioTrack, audioSet, handleMute]);
};

const useParticipantTracks = (
  participant: RTCParticipant
): [VideoTrack | null, AudioTrack | null] => {
  const [videoTrack, setVideoTrack] = React.useState<VideoTrack | null>(null);
  const [audioTrack, setAudioTrack] = React.useState<AudioTrack | null>(null);

  const { setMuted } = useMediaMutedStates();

  const handleMute = React.useCallback(
    (muted: boolean) => {
      setMuted(participant.id, muted);
    },
    [participant.id, setMuted]
  );

  useParticipantLocalTracks(
    !!videoTrack,
    !!audioTrack,
    participant.isMe ? (participant.connection as LocalParticipant) : null,
    setVideoTrack,
    setAudioTrack,
    handleMute
  );

  useParticipantRemoteTracks(
    !!videoTrack,
    !!audioTrack,
    participant.isMe ? null : (participant.connection as RemoteParticipant),
    setVideoTrack,
    setAudioTrack,
    handleMute
  );

  React.useEffect(() => {
    if (!participant.connection) {
      setVideoTrack(null);
      setAudioTrack(null);
    }
  }, [participant]);

  return [videoTrack, audioTrack];
};

export default useParticipantTracks;
