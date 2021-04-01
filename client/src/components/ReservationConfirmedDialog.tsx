import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ReservationData from './ReservationData';

// import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { LobbyGamePlayer } from '../types';

// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     reservationKotitonni: {
//       backgroundColor: 'white',
//     },
//   })
// );

interface ReservationConfirmedDialogProps {
  open: boolean;
  handleClose: () => void;
  lockedReservationData: LobbyGamePlayer;
}

const ReservationConfirmedDialog: React.FC<ReservationConfirmedDialogProps> = ({
  open,
  handleClose,
  lockedReservationData,
}) => {
  // const classes = useStyles();
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{'Varaus onnistui!'}</DialogTitle>
      <DialogContent>
        <ReservationData data={lockedReservationData} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" autoFocus>
          Selvä
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReservationConfirmedDialog;
