import React from 'react';
import { useDispatch } from 'react-redux';
import useHostGameToken from '../hooks/useHostGameToken';
import usePlayerGameToken from '../hooks/usePlayerGameToken';
import useSpectatorGameToken from '../hooks/useSpectatorGameToken';
import { setGame } from '../reducers/rtcGameSlice';
import { Role } from '../types';
import logger from '../utils/logger';
import GameRoom from './GameRoom';

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
  const [gameNullified, setGameNullified] = React.useState(false);
  const dispatch = useDispatch();

  // this makes sure game is initially null
  React.useEffect(() => {
    if (!gameNullified) {
      logger.log('setting initial game null');

      dispatch(setGame(null));

      setGameNullified(true);
    }
  }, [dispatch, gameNullified]);

  if (!gameNullified) {
    return null;
  }

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
