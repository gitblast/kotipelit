import React from 'react';
import ChoosePrice from './ChoosePrice';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { RTCKotitonniPlayer } from '../../types';
import {
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Typography,
} from '@material-ui/core';
import PlayerUpdater from './PlayerUpdater';
import InfoTooltip from '../GameCard/InfoTooltip';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    checkBoxLabel: {
      marginLeft: 0,
    },
    pricesBlock: {
      display: 'flex',
      alignItems: 'center',
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
        alignItems: 'normal',
      },
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
  players: RTCKotitonniPlayer[] | null;
  settings: BaseGameSettings;
  error: string | null;
}

const GameSettings: React.FC<GameSettingsProps> = ({
  handleSettingsChange,
  handlePlayerChange,
  players,
  settings,
  error,
}) => {
  const classes = useStyles();

  const handleSpectatorChange = React.useCallback(() => {
    handleSettingsChange((prev: BaseGameSettings) => {
      return {
        ...prev,
        allowedSpectators: prev.allowedSpectators === 0 ? 40 : 0,
      };
    });
  }, [handleSettingsChange]);

  const handlePriceChange = React.useCallback(
    (newPrice: number) => {
      handleSettingsChange((prev: BaseGameSettings) => {
        return { ...prev, price: newPrice };
      });
    },
    [handleSettingsChange]
  );

  if (!players) {
    return error ? (
      <>
        <Typography>
          {`Odottamaton virhe alustaessa pelaajia: ${error}`}
        </Typography>
        <Typography>Päivitä sivu ja yritä uudestaan.</Typography>
      </>
    ) : (
      <CircularProgress />
    );
  }

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
          label={
            <Typography variant="body1" color="initial">
              Kotipelit-tv
            </Typography>
          }
          labelPlacement="start"
        />
        <InfoTooltip
          text={
            'Tällä asetuksella saatte oman live-kanavan, johon voitte pyytää tuttunne katsojiksi. Maksimimäärä katsojia on 40.'
          }
        />
      </div>
      <div className={classes.pricesBlock}>
        <Typography>
          Pelin hinta pelaajille{' '}
          <span>
            {' '}
            <InfoTooltip
              text={
                'Jos haluat veloittaa peli-illoistasi, ota yhteyttä info@kotipelit.com'
              }
            />
          </span>
        </Typography>

        <ChoosePrice price={settings.price} setPrice={handlePriceChange} />
      </div>
      <Typography>Pelin sanat</Typography>
      <PlayerUpdater
        players={players}
        handlePlayerChange={handlePlayerChange}
      />
    </div>
  );
};

export default GameSettings;
