import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { TextField, Typography, Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    seatLock: {
      marginTop: theme.spacing(2),
      textAlign: 'left',
    },
    lockBtn: {
      margin: theme.spacing(4),
      textAlign: 'center',
    },
    disclaimers: {
      fontSize: '0.85rem',

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
  const { t } = useTranslation();
  const classes = useStyles();
  const [name, setName] = React.useState('');
  const [nameError, setNameError] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState('');

  const handleClick = () => {
    if (!name) {
      return setNameError(t('validation.requiredField'));
    }

    if (name.startsWith('spectator')) {
      return setNameError('Nimimerkki ei saa alkaa sanalla "spectator"');
    }

    if (name.length > 10) {
      return setNameError(t('validation.maxLength', { maxLength: 10 }));
    }

    if (!email) {
      return setEmailError(t('validation.requiredField'));
    }

    if (
      !email.match(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      )
    ) {
      return setEmailError(
        t('validation.invalidField', {
          fieldName: t('common.email').toLowerCase(),
        })
      );
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
    <>
      <div className={classes.seatLock}>
        <div>
          <div>
            <TextField
              variant="standard"
              value={name}
              onChange={handleNameChange}
              label={t('common.alias')}
              error={nameError !== ''}
              helperText={nameError}
            />
          </div>
          <div>
            <TextField
              value={email}
              onChange={handleEmailChange}
              label={t('common.email')}
              error={emailError !== ''}
              helperText={emailError}
            />
            <Typography variant="body2" className={classes.disclaimers}>
              {t('lobby.disclaimer')}
            </Typography>
          </div>
        </div>
      </div>
      <Button
        className={classes.lockBtn}
        color="secondary"
        onClick={handleClick}
        disabled={!name || !email}
      >
        {t('lobby.confirmBtn')}
      </Button>
    </>
  );
};

export default LockReservationForm;
