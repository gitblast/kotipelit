import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Paper, Typography, LinearProgress, Button } from '@material-ui/core';
import { Form, Formik, Field } from 'formik';
import useResetPasswordPage from './useResetPasswordPage';
import { TextField } from 'formik-material-ui';
import PasswordStrengthBar from 'react-password-strength-bar';

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
    maxWidth300: {
      // using this since mui text field width is globally fixed (maybe it shouldn't)
      maxWidth: 300,
      margin: 'auto',
    },
  })
);

const ResetPasswordPage = () => {
  const classes = useStyles();

  const {
    validator,
    handleSubmit,
    error,
    passwordChanged,
  } = useResetPasswordPage();

  return (
    <div className={classes.container}>
      <Paper elevation={5} className={classes.formContainer}>
        <Typography align="center">
          {passwordChanged ? 'Salasanan vaihto onnistui!' : 'Vaihda salasana'}
        </Typography>
        {!passwordChanged && (
          <Formik
            initialValues={{ password: '', passwordConfirm: '' }}
            onSubmit={handleSubmit}
            validationSchema={validator}
          >
            {({ isSubmitting, values, submitForm }) => (
              <Form>
                <Field
                  component={TextField}
                  type="password"
                  label="Uusi salasana"
                  name="password"
                />
                <div>
                  <PasswordStrengthBar
                    className={classes.maxWidth300}
                    password={values.password}
                    minLength={8}
                    shortScoreWord={'liian lyhyt'}
                    scoreWords={[
                      'heikko',
                      'heikko',
                      'kohtalainen',
                      'hyvä',
                      'vahva',
                    ]}
                  />
                </div>
                <Field
                  component={TextField}
                  type="password"
                  label="Uusi salasana uudelleen"
                  name="passwordConfirm"
                />
                {isSubmitting && <LinearProgress />}
                {error && (
                  <Typography color="error" className={classes.maxWidth300}>
                    {error}
                  </Typography>
                )}
                <br />
                <Button
                  variant="contained"
                  color="secondary"
                  disabled={isSubmitting}
                  onClick={submitForm}
                >
                  Vaihda
                </Button>
              </Form>
            )}
          </Formik>
        )}
      </Paper>
    </div>
  );
};

export default ResetPasswordPage;
