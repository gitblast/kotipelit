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
    disclaimers: {
      fontSize: '0.85rem',
      textAlign: 'left',
      color: theme.palette.primary.light,
      maxWidth: 300,
    },
  })
);

interface LockReservationFormProps {
  handleLock: (displayName: string, email: string) => void;
}

const LockReservationForm: React.FC<LockReservationFormProps> = ({
  handleLock,
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

    if (name.startsWith('spectator')) {
      return setNameError('Nimimerkki ei saa alkaa sanalla "spectator"');
    }

    if (name.length > 10) {
      return setNameError('Nimen maksimipituus on 10 merkkiä!');
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

    handleLock(name.trim(), email);
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
            variant="standard"
            value={name}
            onChange={handleNameChange}
            label="Nimimerkki"
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
          <Typography variant="body2" className={classes.disclaimers}>
            Saat pelin tiedot sähköpostiisi, emme käytä tietojasi
            markkinointiin. Ilmottautumalla hyväksyt, että pelin aikana
            käytetään videopuheluyhteyttä.
          </Typography>
        </div>
      </div>
      <Button
        className={classes.lockBtn}
        color="secondary"
        onClick={handleClick}
        disabled={!name || !email}
      >
        Vahvista varaus
      </Button>
    </div>
  );
};

export default LockReservationForm;
