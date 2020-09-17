import React from 'react';
import Jitsi from 'react-jitsi';
import { Fab, Typography, CircularProgress } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { ConfigOptions, InterfaceConfigOptions } from 'react-jitsi/dist/types';
import { JitsiApi } from '../types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loader: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    btnContainer: { textAlign: 'center', marginBottom: theme.spacing(2) },
  })
);

const Loader: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.loader}>
      <div>
        <CircularProgress />
      </div>
      <Typography>Ladataan videoyhteyttä...</Typography>
    </div>
  );
};

interface JitsiFrameProps {
  token: string | null;
  roomName: string;
  displayName: string | null;
  loadedCallback?: () => void;
  dev?: boolean;
  isHost?: boolean;
}

const JitsiFrame: React.FC<JitsiFrameProps> = ({
  token,
  roomName,
  displayName,
  loadedCallback,
  dev,
  isHost,
}) => {
  const [showJitsi, setShowJitsi] = React.useState<boolean>(!dev);
  const [jitsi, setJitsi] = React.useState<null | JitsiApi>(null);

  const classes = useStyles();

  React.useEffect(() => {
    return () => jitsi?.dispose();
  }, [jitsi]);

  const handleLeave = (api: JitsiApi) => {
    setShowJitsi(false);
    api.dispose();
  };

  /** attach listeners for jitsi events here. info: https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-iframe */
  const handleAPIloaded = (api: JitsiApi) => {
    api.on('videoConferenceLeft', () => handleLeave(api));

    setJitsi(api);

    if (loadedCallback) loadedCallback();
  };

  if (!showJitsi) {
    return (
      <div className={classes.loader}>
        <div className={classes.btnContainer}>
          <Fab variant="extended" onClick={() => setShowJitsi(true)}>
            Käynnistä video
          </Fab>
        </div>
        {token && (
          <div className={classes.btnContainer}>
            <Fab variant="extended" onClick={loadedCallback}>
              Trigger API loaded
            </Fab>
          </div>
        )}
      </div>
    );
  }

  // host cannot start conference without a token
  if (isHost && !token) return <Loader />;

  // https://github.com/jitsi/jitsi-meet/blob/master/config.js
  const config = {
    subject: ' ', // hides room name
  };

  // https://github.com/jitsi/jitsi-meet/blob/master/interface_config.js
  const interfaceConfig = {
    DEFAULT_REMOTE_DISPLAY_NAME: 'Pelaaja',
    DISABLE_DOMINANT_SPEAKER_INDICATOR: true,
    DISABLE_FOCUS_INDICATOR: true,
    DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
    DISABLE_PRESENCE_STATUS: true,
    DISABLE_RINGING: true,
    DISABLE_TRANSCRIPTION_SUBTITLES: true,
    DISPLAY_WELCOME_PAGE_CONTENT: false,
    DISPLAY_WELCOME_PAGE_TOOLBAR_ADDITIONAL_CONTENT: true,
    ENABLE_DIAL_OUT: false,
    GENERATE_ROOMNAMES_ON_WELCOME_PAGE: false,
    HIDE_INVITE_MORE_HEADER: true,
    SHOW_JITSI_WATERMARK: false,
    SHOW_WATERMARK_FOR_GUESTS: false,
    RECENT_LIST_ENABLED: false,
    TOOLBAR_BUTTONS: ['camera', 'microphone', 'chat', 'fullscreen'],
    MOBILE_APP_PROMO: false,
    DEFAULT_BACKGROUND: '#000000',
  };

  return (
    <Jitsi
      containerStyle={{ width: '100%', height: '100%' }}
      roomName={roomName} // must match room name set in token
      displayName={displayName ? displayName : undefined}
      domain="meet.kotipelit.com"
      jwt={token ? token : undefined} // needs a valid token to auth, see readme
      loadingComponent={Loader}
      onAPILoad={(JitsiMeetApi) => handleAPIloaded(JitsiMeetApi as JitsiApi)}
      config={config as ConfigOptions}
      interfaceConfig={interfaceConfig as InterfaceConfigOptions}
    />
  );
};

export default JitsiFrame;
