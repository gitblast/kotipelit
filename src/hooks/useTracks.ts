import React from 'react';
import {
  AudioTrack,
  LocalParticipant,
  LocalVideoTrack,
  RemoteParticipant,
  RemoteTrack,
  RemoteVideoTrack,
  VideoTrack,
} from 'twilio-video';
import { RTCParticipant } from '../types';

const useLocalVideoTrack = (
  localParticipant: LocalParticipant | null,
  setTrack: (track: LocalVideoTrack) => void
) => {
  React.useEffect(() => {
    if (localParticipant) {
      const track = Array.from(localParticipant.videoTracks.values())[0].track;

      setTrack(track);
    }
  }, [localParticipant, setTrack]);
};

const useRemoteVideoTrack = (
  remoteParticipant: RemoteParticipant | null,
  setTrack: (track: RemoteVideoTrack) => void
) => {
  React.useEffect(() => {
    if (remoteParticipant) {
      remoteParticipant.on('trackSubscribed', (track: RemoteTrack) => {
        if (track.kind === 'video') {
          setTrack(track);
        }
      });
    }
  }, [remoteParticipant, setTrack]);
};

const useTracks = (
  participant: RTCParticipant
): [VideoTrack | null, AudioTrack | null] => {
  const [videoTrack, setVideoTrack] = React.useState<VideoTrack | null>(null);
  const [audioTrack, setAudioTrack] = React.useState<AudioTrack | null>(null);

  useLocalVideoTrack(
    participant.isMe ? (participant.connection as LocalParticipant) : null,
    setVideoTrack
  );

  useRemoteVideoTrack(
    participant.isMe ? null : (participant.connection as RemoteParticipant),
    setVideoTrack
  );

  React.useEffect(() => {
    if (!participant.connection) {
      setVideoTrack(null);
      setAudioTrack(null);
    }
  }, [participant]);

  return [videoTrack, audioTrack];
};

export default useTracks;
