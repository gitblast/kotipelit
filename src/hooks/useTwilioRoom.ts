import React from 'react';

import * as Video from 'twilio-video';
import { RTCParticipant } from '../types';

import logger from '../utils/logger';

const listeners = (videoRoom: Video.Room) => {
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
  initialParticipants: RTCParticipant[] | null
) => {
  const [room, setRoom] = React.useState<null | Video.Room>(null);
  const [localTracks, setLocalTracks] = React.useState<
    null | Video.LocalTrack[]
  >(null);
  const [error, setError] = React.useState<null | string>(null);
  const [participants, setParticipants] = React.useState<
    RTCParticipant[] | null
  >(null);

  React.useEffect(() => {
    const getLocalTracks = async () => {
      const tracks = await Video.createLocalTracks();

      logger.log('getting local media tracks');

      setLocalTracks(tracks);
    };

    if (participants && onCall && !localTracks) {
      try {
        getLocalTracks();
      } catch (error) {
        logger.error(`error getting tracks: ${error.message}`);

        setError(`error getting tracks: ${error.message}`);
      }
    }
  }, [onCall, localTracks, participants]);

  React.useEffect(() => {
    const participantConnected = (participant: Video.RemoteParticipant) => {
      logger.log(
        `participant '${participant.identity}' connected`,
        participant
      );

      setParticipants((previous) => {
        if (!previous) return previous;

        return previous.map((oldParticipant) =>
          oldParticipant.id === participant.identity
            ? { ...oldParticipant, connection: participant }
            : oldParticipant
        );
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
          return oldParticipant.id === participant.identity
            ? { ...oldParticipant, connection: null }
            : oldParticipant;
        });
      });
    };

    const connectToRoom = async (token: string, tracks: Video.LocalTrack[]) => {
      const videoRoom = await Video.connect(token, {
        tracks,
      });

      logger.log('setting twilio room:', videoRoom);

      setRoom(videoRoom);

      videoRoom.on('participantConnected', participantConnected);

      videoRoom.on('participantDisconnected', participantDisconnected);

      videoRoom.participants.forEach(participantConnected);

      listeners(videoRoom);
    };

    if (!room && accessToken && localTracks && participants) {
      try {
        connectToRoom(accessToken, localTracks);
      } catch (error) {
        logger.error(`error connecting to room: ${error.message}`);

        setError(`error connecting to room: ${error.message}`);
      }
    }
  }, [room, accessToken, localTracks, participants]);

  React.useEffect(() => {
    if (initialParticipants && !participants) {
      setParticipants(initialParticipants);
    }
  }, [participants, initialParticipants]);

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

  const participantsWithLocalSet =
    room && participants
      ? participants.map((participant) => {
          return participant.isMe
            ? { ...participant, connection: room.localParticipant }
            : participant;
        })
      : null;

  return {
    participants: participantsWithLocalSet,
    error,
  };
};

export default useTwilioRoom;
