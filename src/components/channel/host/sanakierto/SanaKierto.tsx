import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => createStyles({}));

// interface SanaKiertoProps {}

const SanaKierto: React.FC = () => {
  const classes = useStyles();

  return <div>content</div>;
};

export default SanaKierto;
