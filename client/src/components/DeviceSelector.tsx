import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      padding: theme.spacing(1),
      display: 'flex',
    },
  })
);

interface AudioDeviceSelectorProps {
  currentDeviceId: string | null;
  handleTrackChange: (newDeviceId: string) => void;
  mediaDevices: MediaDeviceInfo[] | null;
  mediaType: 'audio' | 'video';
}

const AudioDeviceSelector: React.FC<AudioDeviceSelectorProps> = ({
  currentDeviceId,
  handleTrackChange,
  mediaDevices,
  mediaType,
}) => {
  const classes = useStyles();
  const [selected, setSelected] = React.useState(currentDeviceId ?? '');

  React.useEffect(() => {
    if (currentDeviceId) {
      setSelected(currentDeviceId);
    }
  }, [currentDeviceId]);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelected(event.target.value as string);
    handleTrackChange(event.target.value as string);
  };

  return (
    <FormControl className={classes.formControl}>
      <InputLabel id={`${mediaType}-device-select`}>
        {mediaType === 'audio' ? 'Mikrofoni' : 'Kamera'}
      </InputLabel>
      <Select
        labelId={`${mediaType}-device-select`}
        value={selected}
        onChange={handleChange}
      >
        {mediaDevices?.map((device) => (
          <MenuItem key={device.deviceId} value={device.deviceId}>
            {device.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default AudioDeviceSelector;
