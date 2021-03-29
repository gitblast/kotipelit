import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { GameType } from '../../types';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from '@material-ui/core';

import kotitonniImg from '../../assets/images/kotitonni.png';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    gameCard: {
      maxWidth: 280,
      background: 'rgb(29 18 55)',
      border: '2px dotted white',
      color: 'rgb(185 231 229)',
      textAlign: 'center',
      padding: theme.spacing(2),
    },
    kotitonniImage: {
      height: 100,
    },
    cardBottom: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      color: 'white',
    },
    gameInfo: {
      color: 'rgb(185 231 229)',
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
            <Typography variant="subtitle1">Kotitonni</Typography>
            <CardMedia>
              <img
                src={kotitonniImg}
                alt="kotitonni"
                className={classes.kotitonniImage}
              />
            </CardMedia>
            <Typography variant="body2" component="p">
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
