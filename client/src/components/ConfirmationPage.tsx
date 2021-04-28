import { Paper, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import { useUser } from '../context';
import userService from '../services/users';
import Loader from './Loader';

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

  const { user, setUser } = useUser();

  const history = useHistory();

  const { confirmationId } = useParams<{ confirmationId: string }>();

  React.useEffect(() => {
    const confirmUser = async () => {
      setLoading(true);

      try {
        const verifiedUser = await userService.verifyConfirmationId(
          confirmationId
        );

        userService.setToken(verifiedUser.token);

        setUser({
          ...verifiedUser,
          loggedIn: true,
        });
      } catch (e) {
        setError(e.response?.data);
      } finally {
        setLoading(false);
      }
    };

    if (!user.loggedIn) {
      confirmUser();
    }
  }, [confirmationId, user.loggedIn, setUser]);

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
