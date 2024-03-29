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
import { Link, Redirect } from 'react-router-dom';
import * as Yup from 'yup';
import { useUser } from '../../context';
import ForgotPasswordDialog from './ForgotPasswordDialog';
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
      color: theme.palette.text.primary,
    },
    forgotPassword: {
      cursor: 'pointer',
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

  const [showForgotPasswordForm, setShowForgotPasswordForm] = React.useState(
    false
  );

  const { handleLogin, emailNotVerified } = useLogin();

  const { user, loading } = useUser();

  if (user.loggedIn) {
    return <Redirect to={`/${user.username}`} />;
  }

  const validator = Yup.object({
    usernameOrEmail: Yup.string().required(
      'Anna käyttäjänimi tai sähköpostiosoite'
    ),
    password: Yup.string().required('Anna salasana'),
  });

  return (
    <div className={classes.container}>
      <ForgotPasswordDialog
        open={showForgotPasswordForm}
        handleClose={() => setShowForgotPasswordForm(false)}
      />
      <Paper elevation={3} className={classes.loginField}>
        {emailNotVerified ? (
          <ConfirmEmailMessage />
        ) : (
          <Formik
            initialValues={{ usernameOrEmail: '', password: '' }}
            validationSchema={validator}
            onSubmit={async (values, { setStatus }) => {
              try {
                await handleLogin(values.usernameOrEmail, values.password);
              } catch (e) {
                setStatus(e.message); // uses status to show error message
              }
            }}
          >
            {({ submitForm, isSubmitting, status }) => (
              <Form>
                <Field
                  component={OutlinedTextField}
                  name="usernameOrEmail"
                  label="Käyttäjätunnus tai sähköposti"
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
                <div>
                  <Typography
                    variant="caption"
                    onClick={() => setShowForgotPasswordForm(true)}
                    className={classes.forgotPassword}
                  >
                    Unohtunut salasana
                  </Typography>
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
                  {loading ? <CircularProgress /> : 'Kirjaudu'}
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
