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

interface DeviceSelectorProps {
  currentDeviceId: string | null;
  handleTrackChange: (newDeviceId: string) => void;
  mediaDevices: MediaDeviceInfo[] | null;
  mediaType: 'audio' | 'video';
}

const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  currentDeviceId,
  handleTrackChange,
  mediaDevices,
  mediaType,
}) => {
  const classes = useStyles();
  const [selected, setSelected] = React.useState<string>(currentDeviceId ?? '');

  React.useEffect(() => {
    if (currentDeviceId) {
      setSelected(currentDeviceId);
    }
  }, [currentDeviceId]);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelected(event.target.value as string);
    handleTrackChange(event.target.value as string);
  };

  const currentDeviceInDevices = !!mediaDevices?.find(
    (device) => device.deviceId === currentDeviceId
  );

  return (
    <FormControl className={classes.formControl}>
      <InputLabel id={`${mediaType}-device-select`}>
        {mediaType === 'audio' ? 'Mikrofoni' : 'Kamera'}
      </InputLabel>
      <Select
        labelId={`${mediaType}-device-select`}
        // here we make sure we don't pass an out of range value to select component
        value={currentDeviceInDevices ? selected : ''}
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

export default DeviceSelector;
