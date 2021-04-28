import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mediaContainer: {
      position: 'relative',
      overflow: 'hidden',
      paddingTop: '56.25%',
    },
    iframeStyle: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      border: 0,
    },
  })
);

const VimeoMedia = () => {
  const classes = useStyles();
  return (
    <>
      <div className={classes.mediaContainer}>
        <iframe
          className={classes.iframeStyle}
          src="https://player.vimeo.com/video/541056500?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;dnt=1"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          title="Kotitonni"
        ></iframe>
      </div>
    </>
  );
};

export default VimeoMedia;
