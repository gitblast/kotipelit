import React from 'react';
import { useDispatch } from 'react-redux';

import { RTCGame } from '../types';

import logger from '../utils/logger';

import { setSelf } from '../reducers/rtcSelfSlice';

interface MySelf {
  id: string;
  isHost: boolean;
}

const getMyId = (game: RTCGame, isHost?: boolean) => {
  if (isHost) {
    return game.host.id;
  }

  const playerWithPrivateDataExposed = game.players.find(
    (p) => !!p.privateData
  );

  return playerWithPrivateDataExposed?.id ?? null;
};

const useSelf = (game: RTCGame | null, isHost?: boolean) => {
  const [mySelf, setMySelf] = React.useState<null | MySelf>(null);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!mySelf && game) {
      const myId = getMyId(game, isHost);

      if (!myId) {
        logger.error('self object not found!');
      } else {
        const self = {
          id: myId,
          isHost: !!isHost,
        };

        dispatch(setSelf(self));

        setMySelf(self);
      }
    }
  }, [game, mySelf, isHost, dispatch]);

  return mySelf;
};

export default useSelf;
