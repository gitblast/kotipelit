import React from 'react';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import { GameType } from '../../types';
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
} from '@material-ui/core';

import kotitonniImg from '../../assets/images/Kotitonni.png';

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
      <Typography>Valitse mitä pelataan</Typography>
      <Card
        className={classes.gameCard}
        onClick={() => handleSelect(GameType.KOTITONNI)}
        elevation={3}
      >
        <CardActionArea>
          <CardMedia
            component="img"
            alt="Kotitonni"
            height="200"
            image={kotitonniImg}
            title="Kotitonni"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              Kotitonni
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Pelaajille lähetetään ennen peliä 3 sanaa, joihin he miettivät
              vihjeet. Pelaajat kirjoittavat sinulle vastauksensa. Vastausaika
              on 60 sekuntia.
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
