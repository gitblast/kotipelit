import React, { useState, useEffect } from 'react';

const useDevices = (premissionsGranted: boolean) => {
  const [devices, setDevices] = useState<MediaDeviceInfo[] | null>(null);

  useEffect(() => {
    const getDevices = async () => {
      const newDevices = await navigator.mediaDevices.enumerateDevices();

      setDevices(newDevices);
    };

    navigator.mediaDevices.addEventListener('devicechange', getDevices);

    getDevices();

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', getDevices);
    };
  }, [premissionsGranted]);

  const audioInputDevices = React.useMemo(
    () => devices?.filter((device) => device.kind === 'audioinput') ?? null,
    [devices]
  );

  const videoInputDevices = React.useMemo(
    () => devices?.filter((device) => device.kind === 'videoinput') ?? null,
    [devices]
  );

  return {
    audioInputDevices,
    videoInputDevices,
  };
};

export default useDevices;
