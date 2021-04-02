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
import { useGameErrorState } from '../context';

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
    shutDownLocalTracks,
  } = useLocalTracks(onCall && !isSpectator);
  const localTracks = React.useMemo<
    [Video.LocalVideoTrack, Video.LocalAudioTrack] | null
  >(() => {
    return !!localVideoTrack && !!localAudioTrack
      ? [localVideoTrack, localAudioTrack]
      : null;
  }, [localVideoTrack, localAudioTrack]);

  const { setError } = useGameErrorState();
  const [participants, setParticipants] = useParticipants(
    game,
    ownId,
    isSpectator
  );

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
      try {
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
      } catch (error) {
        logger.error(`error connecting to room: ${error.message}`);

        setError(error, 'Ongelma yhdistäessä videohuoneeseen');
      }
    };

    if (!room && accessToken && (isSpectator || localTracks) && participants) {
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
    }
  }, [
    room,
    accessToken,
    localTracks,
    participants,
    setParticipants,
    isSpectator,
    setError,
  ]);

  React.useEffect(() => {
    if (room) {
      return () => {
        if (room) {
          logger.log('cleaning up twilio room');

          shutDownLocalTracks();

          room.disconnect();
        }
      };
    }
  }, [room, shutDownLocalTracks]);

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
    room,
    participants: participantsWithLocalSet,
    spectatorCount,
  };
};

export default useTwilioRoom;
