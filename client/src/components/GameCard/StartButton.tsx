import React from 'react';

import { RTCGame, GameStatus } from '../../types';
import Button from '@material-ui/core/Button/Button';
import { Link } from 'react-router-dom';
import useDisabledStatus from './useDisabledStatus';
import { useTranslation } from 'react-i18next';

interface StartButtonProps {
  game: RTCGame;
  hostName: string;
}

const StartButton = ({ game, hostName }: StartButtonProps) => {
  const isDisabled = useDisabledStatus(game.startTime);
  const { t } = useTranslation();

  const label =
    game.status === GameStatus.UPCOMING
      ? t('gameCard.startButton')
      : t('gameCard.joinButton');

  return (
    <Button
      disabled={isDisabled}
      variant="contained"
      color="secondary"
      component={Link}
      to={`/${hostName}/pelit/${game.id}`}
    >
      {label}
    </Button>
  );
};

export default StartButton;
