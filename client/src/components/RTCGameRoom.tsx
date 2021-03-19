import React from 'react';

import usePlayerGameToken from '../hooks/usePlayerGameToken';
import useHostGameToken from '../hooks/useHostGameToken';
import useSpectatorGameToken from '../hooks/useSpectatorGameToken';

import GameRoom from './GameRoom';
import { Role } from '../types';

const RTCGameForSpectator: React.FC = () => {
  const [token, error] = useSpectatorGameToken();

  if (error) {
    console.warn('handle errors');
  }

  return <GameRoom token={token} role={Role.SPECTATOR} />;
};

const RTCGameForPlayer: React.FC = () => {
  const [token, error] = usePlayerGameToken();

  if (error) {
    console.warn('handle errors');
  }

  return <GameRoom token={token} role={Role.PLAYER} />;
};

const RTCGameForHost: React.FC = () => {
  const [token, error] = useHostGameToken();

  if (error) {
    console.warn('handle errors');
  }

  return <GameRoom token={token} role={Role.HOST} />;
};

interface RTCGameRoomProps {
  role: Role;
}

// redirects to correct component
const RTCGameRoom: React.FC<RTCGameRoomProps> = ({ role }) => {
  switch (role) {
    case Role.HOST:
      return <RTCGameForHost />;
    case Role.PLAYER:
      return <RTCGameForPlayer />;
    default:
      return <RTCGameForSpectator />;
  }
};

export default RTCGameRoom;
