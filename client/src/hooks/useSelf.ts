import React from 'react';

import { Role, RTCGame, RTCSelf } from '../types';

import logger from '../utils/logger';

const getMyId = (game: RTCGame, role: Role) => {
  if (role === Role.HOST) {
    return game.host.id;
  }

  const playerWithPrivateDataExposed = game.players.find(
    (p) => !!p.privateData
  );

  return playerWithPrivateDataExposed?.id ?? null;
};

const useSelf = (game: RTCGame | null, role: Role) => {
  const [mySelf, setMySelf] = React.useState<null | RTCSelf>(null);

  React.useEffect(() => {
    if (!mySelf && game && role !== Role.SPECTATOR) {
      const myId = getMyId(game, role);

      if (!myId) {
        logger.error('self object not found!');
      } else {
        const self = {
          id: myId,
          role,
        };

        setMySelf(self);
      }
    }
  }, [game, mySelf, role]);

  return mySelf;
};

export default useSelf;
