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
      backgroundColor: 'rgb(159 210 187)',
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
      {/* Probably better to make i.e. as a Paper because of default Card styles */}
      <Card
        className={classes.gameCard}
        onClick={() => handleSelect(GameType.KOTITONNI)}
        elevation={3}
      >
        <CardActionArea>
          <CardContent>
            <Typography variant="subtitle2">Kotitonni</Typography>

            <CardContent>
              <div className={classes.cardBottom}>
                <Typography variant="body2" component="p">
                  • 5 pelaajaa
                </Typography>
                <Typography variant="body2" component="p">
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
