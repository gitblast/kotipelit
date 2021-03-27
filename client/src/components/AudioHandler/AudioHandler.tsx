import React from 'react';

import KotitonniAudioHandler from './KotitonniAudioHandler';
import logger from '../../utils/logger';

import { GameType } from '../../types';
import { useGameData } from '../../context';

const AudioHandler: React.FC = () => {
  const { game } = useGameData();

  switch (game.type) {
    case GameType.KOTITONNI:
      return <KotitonniAudioHandler />;
    default: {
      logger.error('invalid game type in audio handler');

      return null;
    }
  }
};

export default React.memo(AudioHandler);
