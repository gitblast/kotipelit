import React from 'react';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import { GameType } from '../../types';
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    gameCard: {
      maxWidth: 280,
    },
    cardBottom: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
    },
  })
);

interface ChooseGameProps {
  handleSelect: (gameType: GameType) => void;
}

const ChooseGame: React.FC<ChooseGameProps> = ({ handleSelect }) => {
  const classes = useStyles();

  return (
    <>
      <Card
        className={classes.gameCard}
        onClick={() => handleSelect(GameType.KOTITONNI)}
        elevation={3}
      >
        <CardActionArea>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              Kotitonni
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Pelaajat saavat ilmottautuessaan 3 sanaa, joihin he miettivät
              vihjeet. Muut koittavat arvata sanan kirjoittamalla sinulle
              vastauksensa.
            </Typography>
            <CardContent>
              <div className={classes.cardBottom}>
                <Typography variant="body2" component="p">
                  • 5 pelaajaa
                </Typography>
                <Typography variant="body2" component="p">
                  • 45-60min
                </Typography>
              </div>
            </CardContent>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
};

export default ChooseGame;
