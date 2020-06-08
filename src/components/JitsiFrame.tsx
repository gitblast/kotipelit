import React from 'react';
import Jitsi from 'react-jitsi';

interface JitsiFrameProps {
  props: null;
}

const JitsiFrame: React.FC<JitsiFrameProps> = () => {
  return (
    <Jitsi
      roomName="testroom123"
      domain="meet.kotipelit.com"
      jwt={undefined} // needs a valid token to auth, see readme
    />
  );
};

export default JitsiFrame;
