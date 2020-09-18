import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  Fab,
  Grid,
  Typography,
  Badge,
  List,
  ListItem,
} from '@material-ui/core';

import { KotitonniActive } from '../../types';
import { FullscreenExit } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    startBtn: {
      textAlign: 'center',
      margin: theme.spacing(2),
    },
    participants: {
      display: 'flex',
      justifyContent: 'space-around',
    },
    welcomeMsg: {
      marginBottom: 40,
    },
    headLine: {
      paddingBottom: 15,
    },
    btnStart: {
      textAlign: 'center',

      padding: 45,
    },
    flexing: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  })
);

interface WaitingRoomProps {
  game: KotitonniActive;
  handleStart?: () => void;
}

const WaitingRoom: React.FC<WaitingRoomProps> = ({ game, handleStart }) => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.flexing}>
        <div className={classes.welcomeMsg}>
          <Typography className={classes.headLine} variant="h5">
            Kiitos kun houstaat pelejä!
          </Typography>
          <Typography>Tässä muutama vinkki:</Typography>
          <List>
            <ListItem>
              1. Voit testata ennen peliä, että kamerayhteys toimii klikkaamalla
              "käynnistä video"
            </ListItem>
            <ListItem>
              2. Pelin aikana voit toistaa pelaajan antaman vihjeen, jotta
              kaikki varmasti kuulevat sen
            </ListItem>
            <ListItem>
              3. Voit ajoittain mutettaa pelaajan jos taustalta kuuluu paljon
              melua
            </ListItem>
            <ListItem>
              4. Peli aukeaa tähän ikkunaan kun klikkaat "Aloita peli"
            </ListItem>
          </List>

          <Typography>Hauskaa kotipeli-iltaa!</Typography>
        </div>
        <div>
          {handleStart && (
            <div className={classes.startBtn}>
              <Fab
                onClick={handleStart}
                variant="extended"
                size="large"
                color="primary"
                className={classes.btnStart}
              >
                Aloita peli
              </Fab>
            </div>
          )}
        </div>
        <div></div>
      </div>
      <div className={classes.participants}>
        {game.players.map((p) => (
          <div key={p.id}>
            <Typography className={classes.participants}>
              {p.name}
              {p.online ? (
                <Badge variant="dot" color="primary"></Badge>
              ) : (
                <Badge variant="dot" color="error"></Badge>
              )}
            </Typography>
          </div>
        ))}
      </div>
    </>
  );
};

export default WaitingRoom;
