import { IconButton } from '@material-ui/core';
import React from 'react';
import { LocalParticipant } from 'twilio-video';
import { RTCParticipant } from '../types';

import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import { useMediaMutedStates } from '../context';

interface MediaControlsProps {
  participant: RTCParticipant;
}

const MediaControls: React.FC<MediaControlsProps> = ({ participant }) => {
  const {
    mutedMap,
    videoDisabledMap,
    toggleMuted,
    toggleVideoDisabled,
  } = useMediaMutedStates();

  const toggleAudio = () => {
    if (participant.isMe) {
      const localParticipant = participant.connection
        ? (participant.connection as LocalParticipant)
        : null;

      // toggle enable/disable audio tracks if self
      localParticipant?.audioTracks.forEach((publication) => {
        const { track } = publication;

        track.isEnabled ? track.disable() : track.enable();
      });
    }

    toggleMuted(participant.id);
  };

  const toggleVideo = () => {
    const localParticipant = participant.connection
      ? (participant.connection as LocalParticipant)
      : null;

    // toggle enable/disable video tracks
    localParticipant?.videoTracks.forEach((publication) => {
      const { track } = publication;

      track.isEnabled ? track.disable() : track.enable();
    });

    toggleVideoDisabled(participant.id);
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={toggleAudio}
        disabled={!participant.connection}
      >
        {mutedMap[participant.id] ? <MicOffIcon color="error" /> : <MicIcon />}
      </IconButton>
      {participant.isMe && (
        <IconButton
          size="small"
          onClick={toggleVideo}
          disabled={!participant.connection}
        >
          {videoDisabledMap[participant.id] ? (
            <VideocamOffIcon color="error" />
          ) : (
            <VideocamIcon />
          )}
        </IconButton>
      )}
    </>
  );
};

export default MediaControls;
