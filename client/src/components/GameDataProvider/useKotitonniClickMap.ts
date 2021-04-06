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

  const setClicked = React.useCallback(
    (playerId: string, clicked: boolean) =>
      setClickedMap((previousState) => {
        return {
          ...previousState,
          [playerId]: clicked,
        };
      }),
    []
  );

  return {
    clickedMap,
    toggleClicked,
    resetClicks,
    setClicked,
  };
};

export default useKotitonniClickMap;
