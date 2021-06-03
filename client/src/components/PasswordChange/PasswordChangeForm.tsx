import React from 'react';
import * as Yup from 'yup';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Typography, LinearProgress, Button } from '@material-ui/core';
import { Form, Formik, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import PasswordStrengthBar from 'react-password-strength-bar';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const classes = useStyles();

  const validator = Yup.object({
    oldPassword: !isReset
      ? Yup.string().required(t('validation.requiredField'))
      : Yup.string(),
    password: Yup.string()
      .min(8, t('validation.minLength', { minLength: 8 }))
      .required(t('validation.requiredField')),
    passwordConfirm: Yup.string()
      .oneOf([Yup.ref('password')], t('validation.passwordsDontMatch'))
      .required(t('validation.requiredField')),
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
                label={t('changePwForm.oldPw')}
                name="oldPassword"
              />
              <br />
            </>
          )}
          <Field
            component={TextField}
            type="password"
            label={t('changePwForm.newPw')}
            name="password"
          />
          <div>
            <PasswordStrengthBar
              className={classes.maxWidth300}
              password={values.password}
              minLength={8}
              shortScoreWord={t('validation.passwordScore.tooShort')}
              scoreWords={[
                t('validation.passwordScore.weak'),
                t('validation.passwordScore.weak'),
                t('validation.passwordScore.moderate'),
                t('validation.passwordScore.good'),
                t('validation.passwordScore.strong'),
              ]}
            />
          </div>
          <Field
            component={TextField}
            type="password"
            label={t('changePwForm.repeatNewPw')}
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
            {t('changePwForm.changeBtn')}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default PasswordChangeForm;
