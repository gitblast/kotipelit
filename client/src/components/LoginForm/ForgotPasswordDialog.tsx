import {
  makeStyles,
  Theme,
  createStyles,
  TextField,
  Button,
  Typography,
  DialogTitle,
} from '@material-ui/core';
import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import userService from '../../services/users';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    email: {
      width: '100%',
    },
    btnContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
  })
);

interface FormDialogProps {
  open: boolean;
  handleClose: () => void;
}

export default function FormDialog({ open, handleClose }: FormDialogProps) {
  const classes = useStyles();

  const [sent, setSent] = React.useState(false);
  const [email, setEmail] = React.useState('');

  const handleSubmit = () => {
    userService.requestPasswordReset(email).catch();

    setSent(true);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle>Resetoi salasana</DialogTitle>
        <DialogContent>
          <Typography>
            Lähetämme sähköpostiisi linkin, jonka avulla voit vaihtaa
            salasanasi.
          </Typography>
          <div>
            {sent ? (
              <Typography variant="caption">
                Palautuslinkin tulisi saapua pian sähköpostiisi
              </Typography>
            ) : (
              <TextField
                label="Sähköposti"
                value={email}
                onChange={({ target }) => setEmail(target.value)}
                className={classes.email}
              />
            )}
            <div className={classes.btnContainer}>
              <Button onClick={handleClose} color="primary">
                Sulje
              </Button>
              <Button disabled={sent} onClick={handleSubmit} color="secondary">
                Lähetä
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
