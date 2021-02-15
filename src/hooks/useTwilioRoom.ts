import React from 'react';

import * as Video from 'twilio-video';

import logger from '../utils/logger';

const useTwilioRoom = (
  accessToken: string | null,
  onCall: boolean,
  initialParticipants: Map<string, Video.Participant | null> | null
): [null | Map<string, Video.Participant | null>, string | null] => {
  const [room, setRoom] = React.useState<null | Video.Room>(null);
  const [localTracks, setLocalTracks] = React.useState<
    null | Video.LocalTrack[]
  >(null);
  const [error, setError] = React.useState<null | string>(null);
  const [participants, setParticipants] = React.useState<Map<
    string,
    Video.Participant | null
  > | null>(null);

  React.useEffect(() => {
    const getLocalTracks = async () => {
      const tracks = await Video.createLocalTracks();

      logger.log('setting local tracks');

      setLocalTracks(tracks);
    };

    if (onCall && !localTracks) {
      try {
        getLocalTracks();
      } catch (error) {
        logger.error(`error getting tracks: ${error.message}`);

        setError(`error getting tracks: ${error.message}`);
      }
    }
  }, [onCall, localTracks]);

  React.useEffect(() => {
    const connectToRoom = async (token: string, tracks: Video.LocalTrack[]) => {
      /* const videoRoom = await Video.connect(token, {
        tracks,
      });

      logger.log('setting twilio room:', videoRoom);

      setRoom(videoRoom); */
    };

    if (!room && accessToken && localTracks) {
      try {
        connectToRoom(accessToken, localTracks);
      } catch (error) {
        logger.error(`error connecting to room: ${error.message}`);

        setError(`error connecting to room: ${error.message}`);
      }
    }
  }, [room, accessToken, localTracks]);

  React.useEffect(() => {
    if (initialParticipants && !participants) {
      setParticipants(initialParticipants);
    }
  }, [participants, initialParticipants]);

  return [participants, error];
};

export default useTwilioRoom;
