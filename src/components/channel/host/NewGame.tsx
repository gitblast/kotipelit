import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { Typography, Divider } from '@material-ui/core';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import fiLocale from 'date-fns/locale/fi';

import { Formik } from 'formik';

import { useHistory } from 'react-router-dom';

import { initializePlayers, renderForm } from './formHelpers';
import { useDispatch } from 'react-redux';
import { addGame } from '../../../reducers/games.reducer';
import { GameType, GameStatus } from '../../../types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formRow: {
      alignItems: 'center',
      marginRight: theme.spacing(2),
    },
    marginRight: {
      marginRight: theme.spacing(2),
    },
    gameInfo: {
      display: 'flex',
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    buttonRow: {
      marginTop: theme.spacing(2),
    },
    wordCell: {
      minWidth: 190,
    },
  })
);

const NewGame: React.FC = () => {
  const classes = useStyles();

  const dispatch = useDispatch();

  // react router
  const history = useHistory();

  /**
   * Redirects back to host main page
   */
  const handleReturn = (): void => {
    history.goBack();
  };

  /** @TODO id hardcored on submit */
  /** @TODO validate inputs with Yup */

  return (
    <div>
      <Typography variant="overline" gutterBottom>
        Luo uusi peli
      </Typography>
      <Divider />
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={fiLocale}>
        <Formik
          initialValues={{
            startTime: new Date(),
            type: GameType.SANAKIERTO,
            players: initializePlayers(),
            status: GameStatus.UPCOMING,
            rounds: 3,
          }}
          onSubmit={(values, actions) => {
            console.log('values', values, 'actions', actions);
            console.log('adding new game');
            dispatch(addGame(values));
            handleReturn();
          }}
        >
          {(props) => renderForm(props, classes, handleReturn)}
        </Formik>
      </MuiPickersUtilsProvider>
    </div>
  );
};

export default NewGame;
