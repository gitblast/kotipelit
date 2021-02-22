import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { GameType } from '../../types';
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    gameCard: {
      maxWidth: 280,
      background: 'linear-gradient(to bottom, #94ccc6, #1c0825)',
      border: '2px dotted white',
      color: 'white',
      textAlign: 'center',
      padding: theme.spacing(2),
    },
    cardBottom: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      color: 'white',
    },
    gameInfo: {
      color: 'white',
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
      {/* Probably better to make i.e. as a Paper because of default Card styles */}
      <Card
        className={classes.gameCard}
        onClick={() => handleSelect(GameType.KOTITONNI)}
        elevation={3}
      >
        <CardActionArea>
          <CardContent>
            <Typography variant="subtitle2">Kotitonni</Typography>
            <Typography component="p">
              Tv-visailun huumaa yksinkertaisessa, mutta hauskassa sanapelissä.
            </Typography>
            <CardContent>
              <div className={classes.cardBottom}>
                <Typography
                  variant="body2"
                  component="p"
                  className={classes.gameInfo}
                >
                  • 5 pelaajaa
                </Typography>
                <Typography
                  variant="body2"
                  component="p"
                  className={classes.gameInfo}
                >
                  • 45 - 60 min
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
