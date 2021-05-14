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

  token.identity = identity;

  const grant = new VideoGrant({ room: roomName });

  token.addGrant(grant);

  return token.toJwt();
};

const getParticipantList = async (gameId: string) => {
  const client = Twilio(config.TWILIO_API_KEY, config.TWILIO_API_SECRET, {
    accountSid: config.TWILIO_ACCOUNT_SID,
  });

  const participants = await client.video
    .rooms(`kotipelit-${gameId}`)
    .participants.list();

  return participants;
};

export default {
  getVideoAccessToken,
  getParticipantList,
};
