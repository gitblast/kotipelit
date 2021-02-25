import { IconButton } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LocalParticipant } from 'twilio-video';
import {
  setMuted,
  setVideoDisabled,
} from '../reducers/kotitonni.local.reducer';
import { RTCParticipant, State } from '../types';

import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';

const useStyles = makeStyles(() =>
  createStyles({
    controlIcon: {
      color: 'white',
    },
  })
);

interface MediaControlsProps {
  participant: RTCParticipant;
}

const MediaControls: React.FC<MediaControlsProps> = ({ participant }) => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const mutedMap = useSelector((state: State) => state.rtc.localData.mutedMap);
  const videoDisabledMap = useSelector(
    (state: State) => state.rtc.localData.videoDisabledMap
  );

  const toggleMuted = () => {
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

    dispatch(setMuted(participant.id, !mutedMap[participant.id]));
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

    dispatch(
      setVideoDisabled(participant.id, !videoDisabledMap[participant.id])
    );
  };

  return (
    <>
      <IconButton
        className={classes.controlIcon}
        size="small"
        onClick={toggleMuted}
        disabled={!participant.connection}
      >
        {mutedMap[participant.id] ? <MicOffIcon color="error" /> : <MicIcon />}
      </IconButton>
      {participant.isMe && (
        <IconButton
          size="small"
          className={classes.controlIcon}
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
