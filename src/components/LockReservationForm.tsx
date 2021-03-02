import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { TextField, Typography, Button } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    lockBtn: {
      margin: theme.spacing(4),
    },
    seatLock: {
      padding: theme.spacing(2),
      [theme.breakpoints.down('xs')]: {
        flexWrap: 'wrap',
      },
    },
  })
);

interface LockReservationFormProps {
  handleReserve: (displayName: string, email: string) => void;
}

const LockReservationForm: React.FC<LockReservationFormProps> = ({
  handleReserve,
}) => {
  const classes = useStyles();
  const [name, setName] = React.useState('');
  const [nameError, setNameError] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState('');

  const handleClick = () => {
    if (!name) {
      return setNameError('Anna nimimerkkisi!');
    }

    if (name.length > 16) {
      return setNameError('Nimen maksimipituus on 16 merkkiä!');
    }

    if (!email) {
      return setEmailError('Anna sähköpostiosoite!');
    }

    if (
      !email.match(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      )
    ) {
      return setEmailError('Tarkista sähköpostiosoite!');
    }

    handleReserve(name, email);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (nameError) {
      setNameError('');
    }

    setName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (emailError) {
      setEmailError('');
    }

    setEmail(e.target.value);
  };

  return (
    <div className={classes.seatLock}>
      <div>
        <div>
          <TextField
            value={name}
            onChange={handleNameChange}
            label="Nimi"
            error={nameError !== ''}
            helperText={nameError}
          />
        </div>
        <div>
          <TextField
            value={email}
            onChange={handleEmailChange}
            label="Sähköpostiosoite"
            error={emailError !== ''}
            helperText={emailError}
          />
          <Typography variant="body2">
            *Saat pelin tiedot sähköpostiisi.
          </Typography>
          <Typography variant="body2">
            Tietosi poistuu järjestelmästä kolmen päivän kuluessa.
          </Typography>
        </div>
      </div>
      <Button
        className={classes.lockBtn}
        color="secondary"
        onClick={handleClick}
        disabled={!name || !email}
      >
        Lukitse
      </Button>
    </div>
  );
};

export default LockReservationForm;
