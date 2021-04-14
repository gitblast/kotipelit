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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      margin: theme.spacing(2),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    loginField: {
      padding: theme.spacing(3),
      maxWidth: 350,
      color: theme.palette.primary.light,
      textAlign: 'center',
      margin: theme.spacing(2),
    },
    menuPaper: {
      maxHeight: 300, // sets max height for birth year popup
    },
    underline: {
      '&:before': {
        borderColor: 'rgb(0 225 217)',
      },
    },
    maxWidth240: {
      maxWidth: 240,
      margin: 'auto',
    },
  })
);

/** sets the underline color for the input */
const StyledSelect = (props: SelectProps) => {
  const classes = useStyles();

  return <MUISelect {...fieldToSelect(props)} className={classes.underline} />;
};

const RegisterPage = () => {
  const classes = useStyles();

  const { handleSubmit, validator, error, userAdded } = useRegisterForm();

  const getBirthDayRange = (startYear = 1920) => {
    return range(new Date().getFullYear(), startYear, -1);
  };

  const successInfo = () => {
    return (
      <>
        <Typography variant="h1" gutterBottom>
          Tilin luonti onnistui!
        </Typography>
        <Typography>
          Sinun tulee vielä vahvistaa sähköpostiosoitteesi. Vahvistuslinkki
          lähetettiin antamaasi osoitteeseen.
        </Typography>
      </>
    );
  };

  return (
    <div className={classes.container}>
      <Paper elevation={3} className={classes.loginField}>
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
                  component={ValidatingTextField}
                  name="username"
                  label="Käyttäjänimi"
                />
                <br />
                <Field component={TextField} name="firstName" label="Etunimi" />
                <br />
                <Field component={TextField} name="lastName" label="Sukunimi" />
                <br />
                <Field
                  component={ValidatingTextField}
                  name="email"
                  type="email"
                  label="Sähköposti"
                />
                <br />
                <FormControl>
                  <InputLabel htmlFor="birthYear">Syntymävuosi</InputLabel>
                  <Field
                    component={StyledSelect}
                    name="birthYear"
                    label="Syntymävuosi"
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
                  label="Salasana"
                  name="password"
                />
                <div className={classes.maxWidth240}>
                  <PasswordStrengthBar
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
                  label="Salasana uudelleen"
                  name="passwordConfirm"
                />
                {isSubmitting && (
                  <LinearProgress className={classes.maxWidth240} />
                )}
                {error && <Typography color="error">{error}</Typography>}
                <br />
                <Button
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  onClick={submitForm}
                >
                  Luo tili
                </Button>
              </Form>
            )}
          </Formik>
        )}
      </Paper>
    </div>
  );
};

export default RegisterPage;
