import React from 'react';

import * as Video from 'twilio-video';

import logger from '../utils/logger';

import useParticipants from './useParticipants';
import useLocalTracks from './useLocalTracks';

const mockRoom = ({
  localParticipant: {
    videoTracks: new Map(),
    audioTracks: new Map(),
    tracks: new Map(),
  } as Video.LocalParticipant,
  disconnect: () => null,
} as unknown) as Video.Room;

const addTracksToMockRoom = (
  localTracks: [Video.LocalVideoTrack, Video.LocalAudioTrack]
) => {
  mockRoom.localParticipant.videoTracks.set('video', {
    kind: 'video',
    track: localTracks[0],
  } as Video.LocalVideoTrackPublication);

  mockRoom.localParticipant.tracks.set('video', {
    kind: 'video',
    track: localTracks[0],
  } as Video.LocalVideoTrackPublication);

  mockRoom.localParticipant.audioTracks.set('audio', {
    kind: 'audio',
    track: localTracks[1],
  } as Video.LocalAudioTrackPublication);

  mockRoom.localParticipant.tracks.set('audio', {
    kind: 'audio',
    track: localTracks[1],
  } as Video.LocalAudioTrackPublication);
};

const addRoomListeners = (videoRoom: Video.Room) => {
  videoRoom.on('participantReconnected', (participant) => {
    logger.log(`participant '${participant.identity}' reconnected`);
  });

  videoRoom.on('participantReconnecting', (participant) => {
    logger.log(`participant '${participant.identity}' reconnecting`);
  });

  videoRoom.on('disconnected', (room, error) => {
    logger.log('twilio room disconnected');

    if (error) {
      logger.error(error.message);
    }
  });

  videoRoom.on('trackPublished', (publication, participant) => {
    logger.log('track was published:', publication, participant);
  });

  videoRoom.on('reconnected', () => {
    logger.log('twilio room reconnected');
  });

  videoRoom.on('reconnecting', (error) => {
    logger.log('twilio room reconnecting');

    if (error) {
      logger.error(error.message);
    }
  });

  window.addEventListener('beforeunload', () => videoRoom.disconnect());
};

const useTwilioRoom = (
  accessToken: string | null,
  onCall: boolean,
  isSpectator: boolean
) => {
  const [room, setRoom] = React.useState<null | Video.Room>(null);
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
  const [participants, setParticipants] = useParticipants(isSpectator);

  if (localTrackError) {
    logger.error(`local track error: ${localTrackError}`);
  }

  React.useEffect(() => {
    const participantConnected = (participant: Video.RemoteParticipant) => {
      logger.log(
        `participant '${participant.identity}' connected`,
        participant
      );

      setParticipants((previous) => {
        if (!previous) return previous;

        return previous.map((oldParticipant) => {
          return participant.identity.startsWith(oldParticipant.id)
            ? { ...oldParticipant, connection: participant }
            : oldParticipant;
        });
      });
    };

    const participantDisconnected = (participant: Video.RemoteParticipant) => {
      logger.log(
        `participant '${participant.identity}' disconnected`,
        participant
      );

      setParticipants((previous) => {
        if (!previous) return previous;

        return previous.map((oldParticipant) => {
          return participant.identity.startsWith(oldParticipant.id)
            ? { ...oldParticipant, connection: null }
            : oldParticipant;
        });
      });
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

          if (localTracks) {
            addTracksToMockRoom(localTracks);
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
  };
};

export default useTwilioRoom;
