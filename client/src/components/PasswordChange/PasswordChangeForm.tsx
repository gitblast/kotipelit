import React from 'react';
import * as Yup from 'yup';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Typography, LinearProgress, Button } from '@material-ui/core';
import { Form, Formik, Field } from 'formik';
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

interface FormValues {
  password: string;
  passwordConfirm: string;
  oldPassword: string;
}

interface PasswordChangeFormProps {
  isReset: boolean;
  handleSubmit: (values: FormValues) => Promise<void>;
  error: string;
}

const PasswordChangeForm = ({
  isReset,
  handleSubmit,
  error,
}: PasswordChangeFormProps) => {
  const classes = useStyles();

  const validator = Yup.object({
    oldPassword: !isReset
      ? Yup.string().required('Pakollinen kenttä')
      : Yup.string(),
    password: Yup.string()
      .min(8, 'Vähintään 8 merkkiä')
      .required('Pakollinen kenttä'),
    passwordConfirm: Yup.string()
      .oneOf([Yup.ref('password')], 'Salasanat eivät täsmää')
      .required('Pakollinen kenttä'),
  });

  return (
    <Formik
      initialValues={{
        password: '',
        passwordConfirm: '',
        oldPassword: '',
      }}
      onSubmit={handleSubmit}
      validationSchema={validator}
    >
      {({ isSubmitting, values, submitForm }) => (
        <Form>
          {!isReset && (
            <>
              <Field
                component={TextField}
                type="password"
                label="Vanha salasana"
                name="oldPassword"
              />
              <br />
            </>
          )}
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
              scoreWords={['heikko', 'heikko', 'kohtalainen', 'hyvä', 'vahva']}
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
  );
};

export default PasswordChangeForm;
