import React from 'react';
import { GameData, GameType } from '../../types';
import useKotitonniClickMap from './useKotitonniClickMap';
import { KotitonniDataProvider, BaseGameDataProvider } from '../../context';
import TimerProvider from '../TimerProvider/TimerProvider';
import GameHistoryProvider from '../GameHistory/GameHistoryProvider';

interface ComponentWithChildren {
  children: React.ReactNode;
}

const KotitonniLocalDataProvider = ({ children }: ComponentWithChildren) => {
  const clickMapData = useKotitonniClickMap();

  return (
    <GameHistoryProvider>
      <TimerProvider>
        <KotitonniDataProvider value={clickMapData}>
          {children}
        </KotitonniDataProvider>
      </TimerProvider>
    </GameHistoryProvider>
  );
};

type GameDataProviderProps = GameData & ComponentWithChildren;

const GameDataProvider = ({
  game,
  updateGame,
  self,
  socket,
  children,
}: GameDataProviderProps) => {
  const baseData = React.useMemo(
    () => ({
      game,
      updateGame,
      self,
      socket,
    }),
    [game, updateGame, self, socket]
  );

  const gameSpecificProviders = () => {
    // handle different game types here
    switch (game.type) {
      case GameType.KOTITONNI:
        return (
          <KotitonniLocalDataProvider>{children}</KotitonniLocalDataProvider>
        );
      default:
        throw new Error(`Invalid game type: ${game.type}`);
    }
  };

  return (
    <BaseGameDataProvider value={baseData}>
      {gameSpecificProviders()}
    </BaseGameDataProvider>
  );
};

export default GameDataProvider;
