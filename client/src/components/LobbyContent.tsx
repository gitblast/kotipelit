import { Button, Paper } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import { LobbyGamePlayer } from '../types';
import LockReservationForm from './LockReservationForm';
import ReservationData from './ReservationData';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    registeredInfo: {
      padding: theme.spacing(2),
      marginTop: theme.spacing(2),
      [theme.breakpoints.down('xs')]: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '90%',
      },
    },
  })
);

interface LobbyContentProps {
  handleReserve: () => void;
  handleLock: (displayName: string, email: string) => void;
  unlockedReservationData: LobbyGamePlayer | null;
  lockedReservationData: LobbyGamePlayer | null;
}

const LobbyContent: React.FC<LobbyContentProps> = ({
  handleReserve,
  handleLock,
  unlockedReservationData,
  lockedReservationData,
}) => {
  const classes = useStyles();

  if (!lockedReservationData && !unlockedReservationData) {
    return (
      <Button onClick={handleReserve} color="secondary">
        Ilmoittaudu peliin
      </Button>
    );
  }

  if (lockedReservationData) {
    return (
      <Paper className={classes.registeredInfo}>
        <ReservationData data={lockedReservationData} />
      </Paper>
    );
  }

  return <LockReservationForm handleLock={handleLock} />;
};

export default LobbyContent;
