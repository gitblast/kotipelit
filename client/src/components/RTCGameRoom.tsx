import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { GameErrorStateProvider } from '../context';
import useHostGameToken from '../hooks/useHostGameToken';
import usePlayerGameToken from '../hooks/usePlayerGameToken';
import useSpectatorGameToken from '../hooks/useSpectatorGameToken';
import { Role } from '../types';
import ErrorFallBack from './ErrorFallBack';
import GameRoom from './GameRoom';
import ErrorDialog from './ErrorDialog';
import useGameError from '../hooks/useGameError';

const RTCGameForSpectator: React.FC = () => {
  const [token] = useSpectatorGameToken();

  return <GameRoom token={token} role={Role.SPECTATOR} />;
};

const RTCGameForPlayer: React.FC = () => {
  const [token] = usePlayerGameToken();

  return <GameRoom token={token} role={Role.PLAYER} />;
};

const RTCGameForHost: React.FC = () => {
  const [token] = useHostGameToken();

  return <GameRoom token={token} role={Role.HOST} />;
};

interface RTCGameRoomProps {
  role: Role;
}

// redirects to correct component
const RTCGameRoom: React.FC<RTCGameRoomProps> = ({ role }) => {
  const gameErrorState = useGameError();

  const { setError, errorState } = gameErrorState;

  const handleRefreshGame = React.useCallback(() => {
    setError(null, '');

    window.location.reload();
  }, [setError]);

  const getContent = () => {
    switch (role) {
      case Role.HOST:
        return <RTCGameForHost />;
      case Role.PLAYER:
        return <RTCGameForPlayer />;
      default:
        return <RTCGameForSpectator />;
    }
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallBack}>
      <GameErrorStateProvider value={gameErrorState}>
        {errorState && (
          <ErrorDialog
            errorState={errorState}
            handleRefreshGame={handleRefreshGame}
          />
        )}
        {getContent()}
      </GameErrorStateProvider>
    </ErrorBoundary>
  );
};

export default RTCGameRoom;
