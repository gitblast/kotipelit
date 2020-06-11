import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  Typography,
  Table,
  TableRow,
  TableCell,
  Fab,
  Checkbox,
  TableHead,
  TableBody,
} from '@material-ui/core';

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

// interface ScoreBoardProps {}

const hardcodedPlayers = ['Pete', 'Samu', 'Jeppe', 'Heka', 'Jykä'];

const ScoreBoard: React.FC = () => {
  const classes = useStyles();

  const [players, setPlayers] = React.useState(hardcodedPlayers);
  const [checkBoxes, setCheckboxes] = React.useState(
    new Array(players.length).fill(false)
  );

  const playerWithTurnIndex = 0;

  const getPointAddition = (playerIndex: number): number => {
    const playerCount = players.length;
    const correctAnswers = checkBoxes.reduce(
      (sum, next) => (next ? sum + 1 : sum),
      0
    );

    switch (correctAnswers) {
      case playerCount - 1: {
        return playerIndex === playerWithTurnIndex ? -50 : 0;
      }
      case 0: {
        return playerIndex === playerWithTurnIndex ? -50 : 0;
      }
      case 1: {
        return checkBoxes[playerIndex] || playerIndex === playerWithTurnIndex
          ? 100
          : 0;
      }
      case 2: {
        return checkBoxes[playerIndex] || playerIndex === playerWithTurnIndex
          ? 30
          : 0;
      }
      case 3: {
        return checkBoxes[playerIndex] || playerIndex === playerWithTurnIndex
          ? 10
          : 0;
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

  const handleUpdate = (): void => {
    console.log('shd');
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
                  {player}
                </TableCell>
                <TableCell align="center">100</TableCell>
                <TableCell
                  align="center"
                  className={`${classes.noPaddingX} ${classes.additionBox}`}
                >
                  {additionElement(getPointAddition(index))}
                </TableCell>
                <TableCell align="center" padding="checkbox">
                  {index === playerWithTurnIndex ? (
                    <Typography variant="caption" color="textSecondary">
                      Kysyjä
                    </Typography>
                  ) : (
                    <Checkbox
                      value={checkBoxes[index]}
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
        <Fab variant="extended" color="primary" onClick={handleUpdate}>
          Päivitä pisteet
        </Fab>
      </div>
    </div>
  );
};

export default ScoreBoard;
