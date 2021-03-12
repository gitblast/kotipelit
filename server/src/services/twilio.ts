import Twilio from 'twilio';

import config from '../utils/config';

const getVideoAccessToken = (identity: string, roomName: string): string => {
  const AccessToken = Twilio.jwt.AccessToken;
  const VideoGrant = AccessToken.VideoGrant;

  const token = new AccessToken(
    config.TWILIO_ACCOUNT_SID,
    config.TWILIO_API_KEY,
    config.TWILIO_API_SECRET
  );

  token.identity = `${identity}-${Date.now()}`;

  const grant = new VideoGrant({ room: roomName });

  token.addGrant(grant);

  return token.toJwt();
};

export default {
  getVideoAccessToken,
};
