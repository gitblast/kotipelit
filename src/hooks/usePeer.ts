import Peer from 'peerjs';
import React from 'react';

import { log } from '../utils/logger';

// const log = (msg: unknown) => console.log(msg);

const usePeer = (): [Peer | null, string | null] => {
  const [peerClient, setPeerClient] = React.useState<Peer | null>(null);
  const [error, setError] = React.useState<null | string>(null);

  React.useEffect(() => {
    if (!peerClient) {
      const port =
        // eslint-disable-next-line no-undef
        process && process.env.NODE_ENV === 'development' ? 3333 : 443;

      log(`using port ${port}`);

      const peer = new Peer({
        host: '/',
        port: port,
        debug: 1,
        path: '/api/peerjs',
      });

      peer.on('error', (error) => {
        console.error('peer error', error.message);

        setError(error.message);
      });

      peer.on('open', () => {
        log(`opened peer connection with id ${peer.id}`);

        setPeerClient(peer);
      });

      peer.on('close', () => {
        log('peer client closed');
      });

      peer.on('disconnected', () => {
        log('peer client disconnected');
      });
    }

    return () => {
      if (peerClient) {
        log(`disconnecting peer`);
        peerClient.destroy();
      }
    };
  }, [peerClient]);

  return [peerClient, error];
};

export default usePeer;
