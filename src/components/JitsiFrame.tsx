import React from 'react';
import Jitsi from 'react-jitsi';

interface JitsiFrameProps {
  token: string;
  roomName: string;
  handleLoaded: () => void;
  dev?: boolean;
}

const JitsiFrame: React.FC<JitsiFrameProps> = ({
  token,
  roomName,
  handleLoaded,
  dev,
}) => {
  if (dev) {
    handleLoaded();
    return <div>Jitsi will render here, triggered onAPIload.</div>;
  }

  return (
    <Jitsi
      roomName={roomName} // must match room name set in token
      domain="meet.kotipelit.com"
      jwt={token} // needs a valid token to auth, see readme
      onAPILoad={handleLoaded}
    />
  );
};

export default JitsiFrame;
