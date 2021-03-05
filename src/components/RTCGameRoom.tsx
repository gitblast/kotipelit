import React from 'react';

import usePlayerGameToken from '../hooks/usePlayerGameToken';
import useHostGameToken from '../hooks/useHostGameToken';

import GameRoom from './GameRoom';

const RTCGameForPlayer: React.FC = () => {
  const [token, error] = usePlayerGameToken();

  if (error) {
    console.warn('handle errors');
  }

  return <GameRoom token={token} />;
};

const RTCGameForHost: React.FC = () => {
  const [token, error] = useHostGameToken();

  if (error) {
    console.warn('handle errors');
  }

  return <GameRoom token={token} isHost={true} />;
};

interface RTCGameRoomProps {
  isHost?: boolean;
}

// redirects to correct component
const RTCGameRoom: React.FC<RTCGameRoomProps> = ({ isHost }) => {
  return isHost ? <RTCGameForHost /> : <RTCGameForPlayer />;
};

export default RTCGameRoom;
