import React from 'react';

const isOver20MinAway = (startTime: Date) =>
  new Date(startTime).getTime() - new Date().getTime() > 20 * 60 * 1000;

const useDisabledStatus = (startTime: Date) => {
  const [isDisabled, setIsDisabled] = React.useState(
    isOver20MinAway(startTime)
  );

  React.useEffect(() => {
    if (isDisabled) {
      const setEnabledIn =
        new Date(startTime).getTime() - new Date().getTime() - 20 * 60 * 1000;

      const handle = setTimeout(() => setIsDisabled(false), setEnabledIn);

      return () => {
        clearTimeout(handle);
      };
    }
  }, [isDisabled, startTime]);

  return isDisabled;
};

export default useDisabledStatus;
