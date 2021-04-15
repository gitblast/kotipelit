import React from 'react';

import { AxiosError } from 'axios';

// import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@material-ui/core';
import { ErrorState } from '../types';
import { Typography } from '@material-ui/core';

// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     container: {
//       padding: theme.spacing(1),
//     },
//   })
// );

interface ErrorDialogProps {
  errorState: ErrorState | null;
  handleRefreshGame: () => void;
  enableRefresh?: boolean;
}

const isAxiosError = (error: any): error is AxiosError => {
  if (!error || !error.isAxiosError || !error.response.data) {
    return false;
  }

  return true;
};

const ErrorDialog = ({
  errorState,
  handleRefreshGame,
  enableRefresh = true,
}: ErrorDialogProps) => {
  const [open, setOpen] = React.useState(!!errorState);

  if (!errorState) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{'Tapahtui virhe'}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {errorState.explanationMsg}
        </DialogContentText>
        <Typography variant="body2">Virheilmoitukset:</Typography>
        <Typography variant="caption">{errorState.error.message}</Typography>
        {isAxiosError(errorState.error) && errorState.error.response?.data && (
          <>
            <br />
            <Typography variant="caption">
              {errorState.error.response?.data}
            </Typography>
          </>
        )}
      </DialogContent>
      <DialogActions>
        {enableRefresh && (
          <Button onClick={handleRefreshGame} variant="text" autoFocus>
            Päivitä sivu
          </Button>
        )}
        <Button onClick={() => setOpen(false)} variant="text" autoFocus>
          Sulje
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ErrorDialog;
