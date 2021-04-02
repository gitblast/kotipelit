import { IconButton } from '@material-ui/core';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import React from 'react';
import { LocalParticipant } from 'twilio-video';
import { useGameData, useMediaMutedStates } from '../context';
import { Role, RTCParticipant } from '../types';
import logger from '../utils/logger';

interface MediaControlsProps {
  participant: RTCParticipant;
}

const MediaControls: React.FC<MediaControlsProps> = ({ participant }) => {
  const { socket, self } = useGameData();

  const {
    mutedMap,
    videoDisabledMap,
    toggleMuted,
    toggleVideoDisabled,
  } = useMediaMutedStates();

  const toggleAudio = () => {
    if (self.role === Role.HOST) {
      const isMuted = !!mutedMap[participant.id];

      logger.log(
        `${isMuted ? 'unmuting' : 'muting'} ${participant.displayName}`
      );

      socket.emit('set-player-muted', participant.id, !isMuted);
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
        disabled={!participant.isMe && self.role !== Role.HOST}
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
