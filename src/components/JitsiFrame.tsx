import React from 'react';
import Jitsi from 'react-jitsi';

interface JitsiFrameProps {
  token: string;
  roomName: string;
  dev?: boolean;
}

const JitsiFrame: React.FC<JitsiFrameProps> = ({ token, roomName, dev }) => {
  if (dev) return <div>Jitsi will render here</div>;

  return (
    <Jitsi
      roomName={roomName} // must match room name set in token
      domain="meet.kotipelit.com"
      jwt={token} // needs a valid token to auth, see readme
    />
  );
};

export default JitsiFrame;
