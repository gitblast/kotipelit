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
  const [selected, setSelected] = React.useState(currentDeviceId ?? '');

  React.useEffect(() => {
    if (currentDeviceId) {
      setSelected(currentDeviceId);
    }
  }, [currentDeviceId]);

  const deviceIndex = React.useMemo(
    () =>
      mediaDevices?.findIndex((device) => device.deviceId === selected) ?? -1,
    [mediaDevices, selected]
  );

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
        value={deviceIndex >= 0 ? deviceIndex : ''}
        onChange={handleChange}
      >
        {mediaDevices?.map((device, index) => (
          <MenuItem key={device.deviceId} value={index}>
            {device.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default DeviceSelector;
