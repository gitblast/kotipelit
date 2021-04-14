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
import * as Yup from 'yup';
import logger from '../utils/logger';
import userService from '../services/users';

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

interface RegisterFormValues {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  birthYear: string;
  password: string;
  passwordConfirm: string;
}

/** sets the underline color for the input */
const StyledSelect = (props: SelectProps) => {
  const classes = useStyles();

  return <MUISelect {...fieldToSelect(props)} className={classes.underline} />;
};

const RegisterPage = () => {
  const classes = useStyles();

  const [userAdded, setUserAdded] = React.useState(false);
  const [error, setError] = React.useState('');

  const getBirthDayRange = (startYear = 1920) => {
    return range(new Date().getFullYear(), startYear, -1);
  };

  const fieldRequiredText = 'Pakollinen kenttä';

  const validator = Yup.object({
    username: Yup.string()
      .matches(/^\S*$/, 'Välilyöntejä ei sallita')
      .min(3, 'Vähintään 3 kirjainta')
      .max(16, 'Korkeintaan 16 kirjainta')
      .required(fieldRequiredText),
    firstName: Yup.string()
      .matches(/^\S*$/, 'Välilyöntejä ei sallita')
      .max(16, 'Korkeintaan 16 kirjainta')
      .required(fieldRequiredText),
    lastName: Yup.string()
      .matches(/^\S*$/, 'Välilyöntejä ei sallita')
      .max(25, 'Korkeintaan 25 kirjainta')
      .required(fieldRequiredText),
    email: Yup.string()
      .matches(/^\S*$/, 'Välilyöntejä ei sallita')
      .email('Virheellinen sähköpostiosoite')
      .required(fieldRequiredText),
    birthYear: Yup.string()
      .matches(/^\d+$/, 'Tulee olla numero')
      .required(fieldRequiredText),
    password: Yup.string()
      .min(8, 'Vähintään 8 merkkiä')
      .required(fieldRequiredText),
    passwordConfirm: Yup.string()
      .oneOf([Yup.ref('password')], 'Salasanat eivät täsmää')
      .required(fieldRequiredText),
  });

  const handleSubmit = async (values: RegisterFormValues) => {
    const {
      username,
      password,
      email,
      birthYear,
      firstName,
      lastName,
    } = values;

    const userToAdd = {
      username,
      password,
      email,
      birthYear: Number(birthYear),
      firstName,
      lastName,
    };

    logger.log(`adding new user`, userToAdd);

    try {
      await userService.addNew(userToAdd);

      setUserAdded(true);
    } catch (e) {
      logger.error(`error adding user: ${e.response?.data}`);

      setError('Tilin luonti epäonnistui. Yritä myöhemmin uudestaan.');
    }
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
                  component={TextField}
                  name="username"
                  label="Käyttäjänimi"
                />
                <br />
                <Field component={TextField} name="firstName" label="Etunimi" />
                <br />
                <Field component={TextField} name="lastName" label="Sukunimi" />
                <br />
                <Field
                  component={TextField}
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
