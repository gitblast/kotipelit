import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { Typography, Divider, Fab, Button } from '@material-ui/core';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import fiLocale from 'date-fns/locale/fi';

import { Formik } from 'formik';

import { useHistory } from 'react-router-dom';

import RenderForm, { initializePlayers } from './RenderForm';
import { useDispatch } from 'react-redux';
import { addGame } from '../../reducers/games.reducer';
import { GameType, GameStatus } from '../../types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    marginRight: {
      marginRight: theme.spacing(2),
    },
    marginTop: {
      marginTop: theme.spacing(2),
    },
  })
);

const NewGame: React.FC = () => {
  const [gameType, setGameType] = React.useState<null | GameType>(null);

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

  /** @TODO validate inputs with Yup ? */

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Luo uusi peli
      </Typography>
      <Divider />
      {gameType ? (
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
            {(formikProps) => (
              <RenderForm
                handleReturn={handleReturn}
                formikProps={formikProps}
              />
            )}
          </Formik>
        </MuiPickersUtilsProvider>
      ) : (
        <div className={classes.marginTop}>
          <div>
            <Typography variant="h6">Pelin tyyppi:</Typography>
            <div>
              <Fab
                onClick={() => setGameType(GameType.SANAKIERTO)}
                variant="extended"
                className={classes.marginTop}
              >
                Sanakierto
              </Fab>
            </div>
            <div>
              <Fab disabled variant="extended" className={classes.marginTop}>
                Toinen peli
              </Fab>
            </div>
            <div>
              <Fab disabled variant="extended" className={classes.marginTop}>
                Kolmas peli
              </Fab>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewGame;
