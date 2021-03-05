import React from 'react';

import KotitonniAudioHandler from './KotitonniAudioHandler';
import { useSelector } from 'react-redux';
import logger from '../utils/logger';

import { GameType, State } from '../types';

const AudioHandler: React.FC = () => {
  const gameType = useSelector((state: State) => state.rtc.game?.type);

  if (!gameType) {
    return null;
  }

  switch (gameType) {
    case GameType.KOTITONNI:
      return <KotitonniAudioHandler />;
    default: {
      logger.error('invalid game type in audio handler');

      return null;
    }
  }
};

export default React.memo(AudioHandler);
