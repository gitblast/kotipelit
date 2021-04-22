import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ReservationData from './ReservationData';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { LobbyGamePlayer } from '../types';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: 'linear-gradient(to bottom, rgb(32 82 100), rgb(14 25 30))',
    },
    dialogHighlights: {
      color: theme.palette.info.main,
    },
  })
);

interface ReservationConfirmedDialogProps {
  open: boolean;
  handleClose: () => void;
  lockedReservationData: LobbyGamePlayer;
  spectatorUrl?: string;
}

const ReservationConfirmedDialog: React.FC<ReservationConfirmedDialogProps> = ({
  open,
  handleClose,
  lockedReservationData,
  spectatorUrl,
}) => {
  const classes = useStyles();
  return (
    <Dialog open={open} onClose={handleClose}>
      <div className={classes.root}>
        <DialogTitle>
          <Typography variant="body1" className={classes.dialogHighlights}>
            Varaus onnistui!
          </Typography>
        </DialogTitle>
        <DialogContent>
          <ReservationData
            data={lockedReservationData}
            spectatorUrl={spectatorUrl}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="text" autoFocus>
            Selvä
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default ReservationConfirmedDialog;
