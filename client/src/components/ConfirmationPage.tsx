import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Loader from './Loader';
import { Paper, Typography } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { State } from '../types';
import { useHistory } from 'react-router';
import userService from '../services/users';
import { loginSuccess } from '../reducers/user.reducer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(2),
    },
  })
);

// interface ConfirmationPageProps {}

const ConfirmationPage = () => {
  const classes = useStyles();
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const history = useHistory();

  const dispatch = useDispatch();

  const user = useSelector((state: State) => state.user);

  const { confirmationId } = useParams<{ confirmationId: string }>();

  React.useEffect(() => {
    const confirmUser = async () => {
      setLoading(true);

      try {
        const verifiedUser = await userService.verifyConfirmationId(
          confirmationId
        );

        userService.setToken(verifiedUser.token);

        dispatch(loginSuccess(verifiedUser));
      } catch (e) {
        setError(e.response?.data);
      } finally {
        setLoading(false);
      }
    };

    if (!user.loggedIn) {
      confirmUser();
    }
  }, [confirmationId, user.loggedIn, dispatch]);

  const getContent = () => {
    if (error) {
      return (
        <>
          <Typography
            color="error"
            gutterBottom
          >{`Virhe vahvistamisessa. Tarkista vahvistuslinkki tai yritä myöhemmin uudelleen.`}</Typography>
          <Typography color="error">{`Virheviesti: ${error}`}</Typography>
        </>
      );
    }

    if (loading) {
      return <Loader msg="Vahvistetaan..." />;
    }

    if (user.loggedIn) {
      setTimeout(() => history.push(`/${user.username}`), 1500);

      return <Typography>Vahvistaminen onnistui!</Typography>;
    }
  };

  return <Paper className={classes.container}>{getContent()}</Paper>;
};

export default ConfirmationPage;
