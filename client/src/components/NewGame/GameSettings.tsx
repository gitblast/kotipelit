import React from 'react';
import ChoosePrice from './ChoosePrice';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { RTCKotitonniPlayer } from '../../types';
import { Checkbox, FormControlLabel, Typography } from '@material-ui/core';
import PlayerUpdater from './PlayerUpdater';

const useStyles = makeStyles(() =>
  createStyles({
    checkBoxLabel: {
      marginLeft: 0,
    },
  })
);

interface BaseGameSettings {
  price: number;
  allowedSpectators: number;
}

interface GameSettingsProps {
  handleSettingsChange: React.Dispatch<React.SetStateAction<BaseGameSettings>>;
  handlePlayerChange: React.Dispatch<
    React.SetStateAction<RTCKotitonniPlayer[] | null>
  >;
  players: RTCKotitonniPlayer[];
  settings: BaseGameSettings;
}

const GameSettings: React.FC<GameSettingsProps> = ({
  handleSettingsChange,
  handlePlayerChange,
  players,
  settings,
}) => {
  const classes = useStyles();

  const handleSpectatorChange = () => {
    const newValue = settings.allowedSpectators === 0 ? 40 : 0;

    handleSettingsChange((prev: BaseGameSettings) => {
      return { ...prev, allowedSpectators: newValue };
    });
  };

  const handlePriceChange = React.useCallback((newPrice: number) => {
    handleSettingsChange((prev: BaseGameSettings) => {
      return { ...prev, price: newPrice };
    });
  }, []);

  return (
    <div>
      <div>
        <FormControlLabel
          className={classes.checkBoxLabel}
          control={
            <Checkbox
              checked={settings.allowedSpectators !== 0}
              onChange={handleSpectatorChange}
            />
          }
          label={'Kotipelit-TV'}
          labelPlacement="start"
        />
      </div>
      <Typography>Pelin hinta</Typography>
      <ChoosePrice price={settings.price} setPrice={handlePriceChange} />
      <PlayerUpdater
        players={players}
        handlePlayerChange={handlePlayerChange}
      />
    </div>
  );
};

export default GameSettings;
