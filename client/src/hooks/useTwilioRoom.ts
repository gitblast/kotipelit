import React from 'react';

import * as Video from 'twilio-video';

import logger from '../utils/logger';

import useParticipants from './useParticipants';
import useLocalTracks from './useLocalTracks';
import { RTCGame } from '../types';

import {
  getMockRoom,
  addTracksToMockRoom,
  addRoomListeners,
} from '../helpers/twilio';

const useTwilioRoom = (
  game: RTCGame | null,
  ownId: string | null,
  accessToken: string | null,
  onCall: boolean,
  isSpectator: boolean
) => {
  const [room, setRoom] = React.useState<null | Video.Room>(null);
  const [spectatorCount, setSpectatorCount] = React.useState(
    isSpectator ? 1 : 0
  );
  const {
    localVideoTrack,
    localAudioTrack,
    error: localTrackError,
  } = useLocalTracks(onCall && !isSpectator);
  const localTracks = React.useMemo<
    [Video.LocalVideoTrack, Video.LocalAudioTrack] | null
  >(() => {
    return !!localVideoTrack && !!localAudioTrack
      ? [localVideoTrack, localAudioTrack]
      : null;
  }, [localVideoTrack, localAudioTrack]);
  const [error, setError] = React.useState<null | string>(null);
  const [participants, setParticipants] = useParticipants(
    game,
    ownId,
    isSpectator
  );

  if (localTrackError) {
    logger.error(`local track error: ${localTrackError}`);
  }

  React.useEffect(() => {
    const participantConnected = (participant: Video.RemoteParticipant) => {
      logger.log(
        `participant '${participant.identity}' connected`,
        participant
      );

      if (participant.identity.startsWith('spectator')) {
        setSpectatorCount((prev) => prev + 1);
      } else {
        setParticipants((previous) => {
          if (!previous) return previous;

          return previous.map((oldParticipant) => {
            return participant.identity.startsWith(oldParticipant.id)
              ? { ...oldParticipant, connection: participant }
              : oldParticipant;
          });
        });
      }
    };

    const participantDisconnected = (participant: Video.RemoteParticipant) => {
      logger.log(
        `participant '${participant.identity}' disconnected`,
        participant
      );

      if (participant.identity.startsWith('spectator')) {
        setSpectatorCount((prev) => (prev > 0 ? prev - 1 : prev));
      } else {
        setParticipants((previous) => {
          if (!previous) return previous;

          return previous.map((oldParticipant) => {
            return participant.identity.startsWith(oldParticipant.id)
              ? { ...oldParticipant, connection: null }
              : oldParticipant;
          });
        });
      }
    };

    /**
     *
     * @param token Twilio access token
     * @param tracks null if spectator, otherwise local tracks
     */
    const connectToRoom = async (
      token: string,
      tracks: Video.LocalTrack[] | null
    ) => {
      const baseConfig = {};

      const config: Video.ConnectOptions = tracks
        ? {
            ...baseConfig,
            tracks,
          }
        : {
            ...baseConfig,
            audio: false,
            video: false,
          };

      const videoRoom = await Video.connect(token, config);

      logger.log('setting twilio room:', videoRoom);

      setRoom(videoRoom);

      videoRoom.on('participantConnected', participantConnected);

      videoRoom.on('participantDisconnected', participantDisconnected);

      // calls setParticipants several times, could be batched
      videoRoom.participants.forEach(participantConnected);

      addRoomListeners(videoRoom);
    };

    if (!room && accessToken && (isSpectator || localTracks) && participants) {
      try {
        logger.log('connecting room');

        if (accessToken === 'DEVELOPMENT') {
          logger.log('setting mock room');

          const mockRoom = getMockRoom();

          if (localTracks) {
            addTracksToMockRoom(localTracks, mockRoom);
          }

          setRoom(mockRoom);
        } else {
          connectToRoom(accessToken, localTracks);
        }
      } catch (error) {
        logger.error(`error connecting to room: ${error.message}`);

        setError(`error connecting to room: ${error.message}`);
      }
    }
  }, [
    room,
    accessToken,
    localTracks,
    participants,
    setParticipants,
    isSpectator,
  ]);

  React.useEffect(() => {
    if (room) {
      return () => {
        if (room) {
          logger.log('cleaning up twilio room');

          room.localParticipant.tracks.forEach((publication) => {
            const { track } = publication;

            if (track.kind === 'video' || track.kind === 'audio') {
              track.stop();
            }
          });

          room.disconnect();
        }
      };
    }
  }, [room]);

  const participantsWithLocalSet = React.useMemo(
    () =>
      room && participants
        ? participants.map((participant) => {
            return participant.isMe
              ? { ...participant, connection: room.localParticipant }
              : participant;
          })
        : null,
    [room, participants]
  );

  return {
    participants: participantsWithLocalSet,
    error,
    spectatorCount,
  };
};

export default useTwilioRoom;
