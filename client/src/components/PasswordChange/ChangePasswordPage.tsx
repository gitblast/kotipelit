import { Paper, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import Loader from '../Loader';
import useChangePasswordPage from './useChangePasswordPage';

const PasswordChangeForm = lazy(() => import('./PasswordChangeForm'));

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

const ChangePasswordPage = () => {
  const { t } = useTranslation();
  const classes = useStyles();

  const { handleSubmit, error, passwordChanged } = useChangePasswordPage();

  return (
    <div className={classes.container}>
      <Paper elevation={5} className={classes.formContainer}>
        <Typography align="center">
          {passwordChanged
            ? t('changePwForm.success')
            : t('changePwForm.changePw')}
        </Typography>
        {!passwordChanged && (
          <Suspense fallback={<Loader msg={t('common.loading')} />}>
            <PasswordChangeForm
              isReset={false}
              handleSubmit={handleSubmit}
              error={error}
            />
          </Suspense>
        )}
      </Paper>
    </div>
  );
};

export default ChangePasswordPage;
