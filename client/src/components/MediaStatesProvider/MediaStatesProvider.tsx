import React from 'react';
import { MediaMutedStatesProvider } from '../../context';
import useMediaStateControls from './useMediaStateControls';

interface MediaStatesProviderProps {
  children: React.ReactNode;
}

const MediaStatesProvider = ({ children }: MediaStatesProviderProps) => {
  const mediaStates = useMediaStateControls();

  return (
    <MediaMutedStatesProvider value={mediaStates}>
      {children}
    </MediaMutedStatesProvider>
  );
};

export default MediaStatesProvider;
