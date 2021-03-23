import React from 'react';

import { Typography } from '@material-ui/core';

interface DevItemsProps {
  forHost?: boolean;
  isMe?: boolean;
  inviteCode?: string;
}

const DevItems: React.FC<DevItemsProps> = ({ forHost, isMe, inviteCode }) => {
  return process && process.env.NODE_ENV === 'development' ? (
    <div style={{ position: 'absolute' }}>
      {forHost && inviteCode && (
        <Typography
          component="div"
          variant="caption"
        >{`http://localhost:3000/username/${inviteCode}`}</Typography>
      )}

      {isMe && (
        <div>
          <Typography color="error" variant="h5">
            ME
          </Typography>
        </div>
      )}
    </div>
  ) : null;
};

export default DevItems;