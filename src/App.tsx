import React from 'react';
import Jitsi from 'react-jitsi';

const App = () => {
  return (
    <div>
      <h1>Jitsi</h1>
      <Jitsi
        roomName="testroom123"
        domain="meet.kotipelit.com"
        jwt={undefined} // needs a valid token to auth, see readme
      />
    </div>
  );
};

export default App;
