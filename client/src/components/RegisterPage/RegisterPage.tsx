import {
  Button,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select as MUISelect,
  Typography,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Field, Form, Formik } from 'formik';
import { fieldToSelect, SelectProps, TextField } from 'formik-material-ui';
import { range } from 'lodash';
import React from 'react';
import PasswordStrengthBar from 'react-password-strength-bar';
import useRegisterForm from './useRegisterForm';
import ValidatingTextField from './ValidatingTextField';
import logoImg from '../../assets/images/logoTransparent.png';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      margin: theme.spacing(3),
      display: 'flex',
      alignItems: 'center',
      [theme.breakpoints.down('sm')]: {
        display: 'initial',
      },
      [theme.breakpoints.down('xs')]: {
        margin: 0,
      },
    },
    loginField: {
      paddingLeft: theme.spacing(6),
      paddingRight: theme.spacing(6),
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      color: theme.palette.primary.light,
      textAlign: 'center',
      margin: theme.spacing(2),
      [theme.breakpoints.down('xs')]: {
        padding: theme.spacing(1),
        margin: theme.spacing(1),
      },
    },
    menuPaper: {
      maxHeight: 300, // sets max height for birth year popup
    },
    underline: {
      '&:before': {
        borderColor: 'rgb(0 225 217)',
      },
    },
    recommendation: {
      fontSize: '0.7rem',
      color: theme.palette.primary.light,
      textAlign: 'left',
      [theme.breakpoints.down('sm')]: {
        textAlign: 'center',
      },
    },
    maxWidth300: {
      maxWidth: 300,
      margin: 'auto',
    },
    welcomeImg: {
      opacity: 0.3,
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
    spacer: {
      // fills empty space
      flex: '1 1 auto',
    },
  })
);

/** sets the underline color for the input */
const StyledSelect = (props: SelectProps) => {
  const classes = useStyles();

  return <MUISelect {...fieldToSelect(props)} className={classes.underline} />;
};

const RegisterPage = () => {
  const { t } = useTranslation();
  const classes = useStyles();

  const { handleSubmit, validator, error, userAdded } = useRegisterForm();

  const getBirthDayRange = (startYear = 1920) => {
    return range(new Date().getFullYear(), startYear, -1);
  };

  const successInfo = () => {
    return (
      <>
        <Typography variant="h1" gutterBottom>
          {t('registerForm.success')}
        </Typography>
        <Typography>{t('registerForm.confirmEmail')}</Typography>
      </>
    );
  };

  return (
    <div className={classes.container}>
      <Paper elevation={5} className={classes.loginField}>
        {userAdded ? (
          successInfo()
        ) : (
          <Formik
            initialValues={{
              username: '',
              firstName: '',
              lastName: '',
              email: '',
              birthYear: '',
              password: '',
              passwordConfirm: '',
            }}
            validationSchema={validator}
            onSubmit={handleSubmit}
          >
            {({ submitForm, isSubmitting, values }) => (
              <Form>
                <Field
                  component={TextField}
                  name="firstName"
                  label={t('common.firstName')}
                />
                <br />
                <Field
                  component={TextField}
                  name="lastName"
                  label={t('common.lastName')}
                />
                <br />
                <Field
                  component={ValidatingTextField}
                  name="username"
                  label={t('common.username')}
                />
                <Typography
                  variant="body2"
                  color="initial"
                  className={classes.recommendation}
                >
                  {t('registerForm.usernameInfo')}
                </Typography>
                <Field
                  component={ValidatingTextField}
                  name="email"
                  type="email"
                  label={t('common.email')}
                />
                <br />
                <FormControl>
                  <InputLabel htmlFor="birthYear">
                    {t('common.birthYear')}
                  </InputLabel>
                  <Field
                    component={StyledSelect}
                    name="birthYear"
                    label={t('common.birthYear')}
                    inputProps={{
                      id: 'birthYear',
                      MenuProps: {
                        classes: { paper: classes.menuPaper },
                      },
                    }}
                  >
                    {getBirthDayRange().map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
                <br />
                <Field
                  component={TextField}
                  type="password"
                  label={t('common.password')}
                  name="password"
                />
                <div className={classes.maxWidth300}>
                  <PasswordStrengthBar
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
                  label={t('common.confirmPassword')}
                  name="passwordConfirm"
                />
                {isSubmitting && (
                  <LinearProgress className={classes.maxWidth300} />
                )}
                {error && <Typography color="error">{error}</Typography>}
                <br />
                <Button
                  variant="contained"
                  color="secondary"
                  disabled={isSubmitting}
                  onClick={submitForm}
                >
                  {t('registerForm.createBtn')}
                </Button>
              </Form>
            )}
          </Formik>
        )}
      </Paper>
      <div className={classes.spacer} />
      <div>
        {' '}
        <img src={logoImg} alt="background" className={classes.welcomeImg} />
      </div>
      <div className={classes.spacer} />
    </div>
  );
};

export default RegisterPage;
