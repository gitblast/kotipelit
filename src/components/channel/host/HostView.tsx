import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import Dashboard from './Dashboard';

const useStyles = makeStyles((theme: Theme) => createStyles({}));

interface HostViewProps {
  gameRunning: boolean;
}

const HostView: React.FC<HostViewProps> = ({ gameRunning }) => {
  const classes = useStyles();

  return gameRunning ? <div>peli</div> : <Dashboard />;
};

export default HostView;
