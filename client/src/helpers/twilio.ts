import * as Video from 'twilio-video';
import logger from '../utils/logger';

export const getMockRoom = () =>
  (({
    localParticipant: {
      videoTracks: new Map(),
      audioTracks: new Map(),
      tracks: new Map(),
    } as Video.LocalParticipant,
    disconnect: () => null,
  } as unknown) as Video.Room);

export const addTracksToMockRoom = (
  localTracks: [Video.LocalVideoTrack, Video.LocalAudioTrack],
  mockRoom: Video.Room
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

export const addRoomListeners = (videoRoom: Video.Room) => {
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
