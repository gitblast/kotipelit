import { Card, CardActions, CardContent, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
// Enable when possible to share on social media
// import ShareIcon from '@material-ui/icons/Share';
import React from 'react';
import { GameStatus, RTCGame } from '../../types';
import GameCardHeader from './GameCardHeader';
import LobbyButton from './LobbyButton';
import PlayerInfo from './PlayerInfo';
import StartButton from './StartButton';
import { getSpectatorUrl } from '../../helpers/games';
import InfoTooltip from './InfoTooltip';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cardStyle: {
      width: 400,
      margin: theme.spacing(2),
      // Ligth version of background
      backgroundColor: 'rgb(15 47 60)',
      border: 'solid rgb(0 225 217)',
      [theme.breakpoints.down('sm')]: {
        margin: theme.spacing(0.7),
      },
    },
    tvLink: {
      fontSize: '1.8rem',
      color: theme.palette.info.main,
      fontFamily: 'BeautySchoolDropoutII',
      textTransform: 'uppercase',
    },
    actions: {
      display: 'flex',
      justifyContent: 'space-between',
      marginRight: theme.spacing(1),
    },
  })
);

interface GameCardProps {
  game: RTCGame;
  hostName: string;
}

const GameCard: React.FC<GameCardProps> = ({ game, hostName }) => {
  const classes = useStyles();

  return (
    <>
      <Card elevation={2} className={classes.cardStyle}>
        <GameCardHeader game={game} />
        <CardContent>
          {game.players.map((player) => (
            <PlayerInfo
              key={player.id}
              player={player}
              gameStatus={game.status}
              hostName={hostName}
              gameId={game.id}
            />
          ))}
        </CardContent>
        {game.allowedSpectators !== 0 && (
          <CardContent>
            <Typography variant="h3" className={classes.tvLink}>
              Kotipelit-tv
              <span>
                <InfoTooltip
                  text={
                    'Jaa tämä linkki kaikille, jotka haluat kutsua katsomaan peliä livenä.'
                  }
                />
              </span>
            </Typography>

            <Typography variant="caption" color="initial">
              {getSpectatorUrl(game.id, game.host.displayName)}
            </Typography>
          </CardContent>
        )}
        <CardActions disableSpacing className={classes.actions}>
          {game.status !== GameStatus.FINISHED && (
            <>
              <LobbyButton game={game} hostName={hostName} />
              <StartButton game={game} hostName={hostName} />
            </>
          )}
        </CardActions>
      </Card>
    </>
  );
};

export default GameCard;
