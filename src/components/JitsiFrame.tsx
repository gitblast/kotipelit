import React from 'react';
import Jitsi from 'react-jitsi';
import { Fab } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    btnContainer: { textAlign: 'center', marginTop: theme.spacing(2) },
  })
);

interface JitsiFrameProps {
  token: string | null;
  roomName: string;
  handleLoaded: () => void;
  dev?: boolean;
}

/** @TODO teardown jitsi? */

const JitsiFrame: React.FC<JitsiFrameProps> = ({
  token,
  roomName,
  handleLoaded,
  dev,
}) => {
  const [showJitsi, setShowJitsi] = React.useState<boolean>(!dev);

  const classes = useStyles();

  if (!showJitsi) {
    return (
      <>
        <div className={classes.btnContainer}>
          <Fab variant="extended" onClick={() => setShowJitsi(true)}>
            Käynnistä video
          </Fab>
        </div>
        {token && (
          <div className={classes.btnContainer}>
            <Fab variant="extended" onClick={handleLoaded}>
              Trigger API loaded
            </Fab>
          </div>
        )}
      </>
    );
  }

  return (
    <Jitsi
      roomName={roomName} // must match room name set in token
      domain="meet.kotipelit.com"
      jwt={token ? token : undefined} // needs a valid token to auth, see readme
      onAPILoad={handleLoaded}
    />
  );
};

export default JitsiFrame;
