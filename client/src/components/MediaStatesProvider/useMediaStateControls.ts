import React from 'react';

const useMediaStateControls = () => {
  const [mutedMap, setMutedMap] = React.useState<Record<string, boolean>>({});
  const [videoDisabledMap, setVideoDisabledMap] = React.useState<
    Record<string, boolean>
  >({});

  const toggleMuted = React.useCallback((participantId: string) => {
    setMutedMap((previousState) => {
      const previouslyMuted = !!previousState[participantId];

      return {
        ...previousState,
        [participantId]: !previouslyMuted,
      };
    });
  }, []);

  const toggleVideoDisabled = React.useCallback((participantId: string) => {
    setVideoDisabledMap((previousState) => {
      const previouslyDisabled = !!previousState[participantId];

      return {
        ...previousState,
        [participantId]: !previouslyDisabled,
      };
    });
  }, []);

  return {
    mutedMap,
    videoDisabledMap,
    toggleMuted,
    toggleVideoDisabled,
  };
};

export default useMediaStateControls;
