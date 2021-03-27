import React from 'react';

import { RTCGame, GameStatus } from '../../types';
import Button from '@material-ui/core/Button/Button';
import { Link } from 'react-router-dom';
import useDisabledStatus from './useDisabledStatus';

interface StartButtonProps {
  game: RTCGame;
  hostName: string;
}

const StartButton = ({ game, hostName }: StartButtonProps) => {
  const isDisabled = useDisabledStatus(game.startTime);

  const label = game.status === GameStatus.UPCOMING ? 'Käynnistä' : 'Liity';

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
