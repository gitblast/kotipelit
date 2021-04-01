import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';
import gameService from '../services/games';
import { useParams } from 'react-router';
import Loader from './Loader';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(3),
    },
  })
);

interface ParamTypes {
  username: string;
  inviteCode: string;
}

// interface CancelPageProps {}

const CancelPage = () => {
  const classes = useStyles();

  const { username, inviteCode } = useParams<ParamTypes>();
  const [error, setError] = React.useState<string | null>(null);

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const cancelReservation = async () => {
      try {
        await gameService.cancelReservation(username, inviteCode);
      } catch (error) {
        setError(`Varauksen peruuttaminen epäonnistui: ${error.response.data}`);
      } finally {
        setLoading(false);
      }
    };

    cancelReservation();
  }, [inviteCode, username]);

  if (loading) {
    return <Loader msg="Ladataan..." />;
  }

  return (
    <Paper className={classes.container}>
      {error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Typography>Varauksen peruuttaminen onnistui</Typography>
      )}
    </Paper>
  );
};

export default CancelPage;
