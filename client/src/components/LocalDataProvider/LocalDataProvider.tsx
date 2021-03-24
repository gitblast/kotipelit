import React from 'react';
import { RTCGame, GameType } from '../../types';
import useKotitonniClickMap from './useKotitonniClickMap';
import { KotitonniDataProvider } from '../../context';
import TimerProvider from '../TimerProvider/TimerProvider';

interface LocalDataProviderProps {
  game: RTCGame;
  children: React.ReactNode;
}

const KotitonniLocalDataProvider = ({
  game,
  children,
}: LocalDataProviderProps) => {
  const clickMapData = useKotitonniClickMap();

  console.log('could pass game here', game);

  return (
    <TimerProvider>
      <KotitonniDataProvider value={clickMapData}>
        {children}
      </KotitonniDataProvider>
    </TimerProvider>
  );
};

const LocalDataProvider = ({ game, children }: LocalDataProviderProps) => {
  switch (game.type) {
    case GameType.KOTITONNI:
      return (
        <KotitonniLocalDataProvider game={game}>
          {children}
        </KotitonniLocalDataProvider>
      );
    default:
      throw new Error(`Invalid game type: ${game.type}`);
  }
};

export default LocalDataProvider;
