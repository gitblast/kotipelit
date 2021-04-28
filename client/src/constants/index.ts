import { DefaultUser } from '../types';

export const SAVED_VIDEO_DEVICE_ID = 'kotipelit-selected-video-input';
export const SAVED_AUDIO_DEVICE_ID = 'kotipelit-selected-audio-input';

export const DEFAULT_VIDEO_CONSTRAINTS = {
  frameRate: 24,
};

export const DEFAULT_AUDIO_CONSTRAINTS: MediaTrackSettings = {
  noiseSuppression: true,
  echoCancellation: true,
};

export const DEFAULT_USER: DefaultUser = {
  loggedIn: false,
};
