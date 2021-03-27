import React from 'react';

const useKotitonniClickMap = () => {
  const [clickedMap, setClickedMap] = React.useState<Record<string, boolean>>(
    {}
  );

  const toggleClicked = React.useCallback((playerId: string) => {
    setClickedMap((previousState) => {
      const previousClickState = !!previousState[playerId];

      return {
        ...previousState,
        [playerId]: !previousClickState,
      };
    });
  }, []);

  const resetClicks = React.useCallback(() => setClickedMap({}), []);

  return {
    clickedMap,
    toggleClicked,
    resetClicks,
  };
};

export default useKotitonniClickMap;
