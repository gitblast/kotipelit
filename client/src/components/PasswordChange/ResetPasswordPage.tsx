import { Paper, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import PasswordChangeForm from './PasswordChangeForm';
import useResetPasswordPage from './useResetPasswordPage';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      justifyContent: 'center',
    },
    formContainer: {
      padding: theme.spacing(4),
      textAlign: 'center',
    },
  })
);

const ResetPasswordPage = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  const { handleSubmit, error, passwordChanged } = useResetPasswordPage();

  return (
    <div className={classes.container}>
      <Paper elevation={5} className={classes.formContainer}>
        <Typography align="center">
          {passwordChanged
            ? t('changePwForm.success')
            : t('changePwForm.changePw')}
        </Typography>
        {!passwordChanged && (
          <PasswordChangeForm
            isReset={true}
            handleSubmit={handleSubmit}
            error={error}
          />
        )}
      </Paper>
    </div>
  );
};

export default ResetPasswordPage;
