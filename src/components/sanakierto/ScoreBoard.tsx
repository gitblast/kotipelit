import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  Typography,
  Table,
  TableRow,
  TableCell,
  Fab,
  Checkbox,
  TableBody,
} from '@material-ui/core';
import { KotitonniPlayer } from '../../types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginTop: theme.spacing(2),
    },
    noPaddingX: {
      paddingLeft: 0,
      paddingRight: 0,
    },
    saveBtnContainer: {
      textAlign: 'center',
      marginTop: theme.spacing(2),
    },
    additionBox: {
      minWidth: 50,
    },
  })
);

interface ScoreBoardProps {
  players: KotitonniPlayer[];
  turn: number;
  handleUpdate: (players: KotitonniPlayer[]) => void;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({
  players,
  turn,
  handleUpdate,
}) => {
  const classes = useStyles();
  const [checkBoxes, setCheckboxes] = React.useState(
    new Array(players.length).fill(false)
  );

  const getPointAddition = (playerIndex: number): number => {
    const playerCount = players.length;
    const correctAnswers = checkBoxes.reduce(
      (sum, next) => (next ? sum + 1 : sum),
      0
    );

    switch (correctAnswers) {
      case playerCount - 1: {
        return playerIndex === turn ? -50 : 0;
      }
      case 0: {
        return playerIndex === turn ? -50 : 0;
      }
      case 1: {
        return checkBoxes[playerIndex] || playerIndex === turn ? 100 : 0;
      }
      case 2: {
        return checkBoxes[playerIndex] || playerIndex === turn ? 30 : 0;
      }
      case 3: {
        return checkBoxes[playerIndex] || playerIndex === turn ? 10 : 0;
      }
    }

    return correctAnswers;
  };

  const additionElement = (addition: number) => {
    const valueString = addition > 0 ? `+${addition}` : `${addition}`;
    let color = '';

    if (addition > 0) color = 'green';
    if (addition < 0) color = 'red';

    return <span style={{ color }}>{valueString}</span>;
  };

  const updateGameState = () => {
    const newPlayers: KotitonniPlayer[] = players.map((player, index) => {
      return {
        ...player,
        points: player.points + getPointAddition(index),
      };
    });

    setCheckboxes(new Array(players.length).fill(false));
    handleUpdate(newPlayers);
  };

  return (
    <div className={classes.container}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell padding="none" align="center">
              <Typography variant="overline">Pelaaja</Typography>
            </TableCell>
            <TableCell padding="none" align="center">
              <Typography variant="overline">Pisteet</Typography>
            </TableCell>
            <TableCell padding="none" align="center">
              <Typography variant="overline">+ / -</Typography>
            </TableCell>
            <TableCell padding="none" align="center">
              <Typography variant="overline" noWrap>
                Vastaus oikein
              </Typography>
            </TableCell>
          </TableRow>
          {players.map((player, index) => {
            return (
              <TableRow key={index}>
                <TableCell className={classes.noPaddingX} align="center">
                  <span>{player.name}</span>
                  {player.online ? null : (
                    <Typography
                      variant="caption"
                      color="error"
                    >{` (offline)`}</Typography>
                  )}
                </TableCell>
                <TableCell align="center">{player.points}</TableCell>
                <TableCell
                  align="center"
                  className={`${classes.noPaddingX} ${classes.additionBox}`}
                >
                  {additionElement(getPointAddition(index))}
                </TableCell>
                <TableCell align="center" padding="checkbox">
                  {index === turn ? (
                    <Typography variant="caption" color="textSecondary">
                      Kysyjä
                    </Typography>
                  ) : (
                    <Checkbox
                      value={checkBoxes[index]}
                      checked={checkBoxes[index]}
                      onChange={() => {
                        const newValues = [...checkBoxes];
                        newValues[index] = !newValues[index];
                        setCheckboxes(newValues);
                      }}
                    />
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div className={classes.saveBtnContainer}>
        <Fab variant="extended" color="primary" onClick={updateGameState}>
          Päivitä pisteet
        </Fab>
      </div>
    </div>
  );
};

export default ScoreBoard;
