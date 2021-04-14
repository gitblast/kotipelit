import {
  Button,
  CircularProgress,
  LinearProgress,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Field, Form, Formik } from 'formik';
import { fieldToTextField, TextFieldProps } from 'formik-material-ui';
import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import * as Yup from 'yup';
import { State } from '../../types';
import useLogin from './useLogin';

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

    maxWidth240: {
      maxWidth: 240,
      marginTop: theme.spacing(1),
    },
    submitBtn: {
      marginTop: theme.spacing(2),
    },
    registerLink: {
      textDecoration: 'none',
      color: 'rgb(0 225 217)',
    },
  })
);

const OutlinedTextField = (props: TextFieldProps) => {
  const {
    form: { setFieldValue, setStatus },
    field: { name },
  } = props;

  const onChange = React.useCallback(
    (event) => {
      const { value } = event.target;
      setStatus(null); // hides possible credential error message
      setFieldValue(name, value);
    },
    [setFieldValue, setStatus, name]
  );

  const onFocus = React.useCallback(
    () => setStatus(null), // hides possible credential error message,
    [setStatus]
  );

  return (
    <TextField
      {...fieldToTextField(props)}
      onChange={onChange}
      onFocus={onFocus}
      variant="outlined"
    />
  );
};

const ConfirmEmailMessage = () => {
  return (
    <>
      <Typography variant="h1" gutterBottom>
        Sinun täytyy vahvistaa sähköpostiosoitteesi jatkaaksesi.
      </Typography>
      <Typography variant="body1">
        Vahvistuslinkki on lähetetty sähköpostiisi. Tarkistathan myös
        roskapostikansiosi.
      </Typography>
    </>
  );
};

const LoginForm: React.FC = () => {
  const classes = useStyles();

  const { handleLogin, emailNotVerified } = useLogin();

  const user = useSelector((state: State) => state.user, shallowEqual);

  if (user.loggedIn) {
    return <Redirect to={`/${user.username}`} />;
  }

  const validator = Yup.object({
    username: Yup.string().required('Anna käyttäjänimi'),
    password: Yup.string().required('Anna salasana'),
  });

  return (
    <div className={classes.container}>
      <Paper elevation={3} className={classes.loginField}>
        {emailNotVerified ? (
          <ConfirmEmailMessage />
        ) : (
          <Formik
            initialValues={{ username: '', password: '' }}
            validationSchema={validator}
            onSubmit={async (values, { setStatus }) => {
              try {
                await handleLogin(values.username, values.password);
              } catch (e) {
                setStatus(e.message);
              }
            }}
          >
            {({ submitForm, isSubmitting, status }) => (
              <Form>
                <Field
                  component={OutlinedTextField}
                  name="username"
                  label="Käyttäjätunnus"
                />
                <br />
                <Field
                  component={OutlinedTextField}
                  name="password"
                  type="password"
                  label="Salasana"
                />
                <br />

                {status && ( // displays possible error message, i.e. incorrect credentials
                  <Typography variant="body2" color="error" gutterBottom>
                    {status}
                  </Typography>
                )}
                <div>
                  <Link to="/rekisteroidy" className={classes.registerLink}>
                    Ei vielä tiliä? Rekisteröidy
                  </Link>
                </div>
                {isSubmitting && (
                  <LinearProgress className={classes.maxWidth240} />
                )}
                <Button
                  disabled={isSubmitting}
                  color="secondary"
                  onClick={submitForm}
                  className={classes.submitBtn}
                >
                  {user.loggingIn ? <CircularProgress /> : 'Kirjaudu'}
                </Button>
              </Form>
            )}
          </Formik>
        )}
      </Paper>
    </div>
  );
};

export default LoginForm;
