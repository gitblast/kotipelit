import Peer from 'peerjs';
import React from 'react';

import logger from '../utils/logger';

const usePeer = (): [Peer | null, string | null] => {
  const [peerClient, setPeerClient] = React.useState<Peer | null>(null);
  const [error, setError] = React.useState<null | string>(null);

  React.useEffect(() => {
    if (!peerClient) {
      const port =
        // eslint-disable-next-line no-undef
        process && process.env.NODE_ENV === 'development' ? 3333 : 443;

      logger.log(`using port ${port}`);

      const peer = new Peer({
        host: '/',
        port: port,
        debug: 1,
        path: '/api/peerjs',
      });

      peer.on('error', (error) => {
        logger.error('peer error', error.message);

        setError(error.message);
      });

      peer.on('open', () => {
        logger.log(`opened peer connection with id ${peer.id}`);

        setPeerClient(peer);
      });

      peer.on('close', () => {
        logger.log('peer client closed');
      });

      peer.on('disconnected', () => {
        logger.log('peer client disconnected');
      });
    }

    return () => {
      if (peerClient) {
        logger.log(`disconnecting peer`);
        peerClient.destroy();
      }
    };
  }, [peerClient]);

  return [peerClient, error];
};

export default usePeer;
