import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { KotitonniPlayer } from '../../types';
import {
  Typography,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Fab,
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(2),
      textAlign: 'center',
    },
    marginTop: {
      marginTop: theme.spacing(2),
    },
  })
);

interface ResultsProps {
  results: KotitonniPlayer[];
  handleTearDown?: () => void;
}

const Results: React.FC<ResultsProps> = ({ results, handleTearDown }) => {
  const classes = useStyles();

  // use state to persist results even when host ends game
  const [savedResults] = React.useState(results);

  return (
    <div className={classes.container}>
      <Typography variant="h4" gutterBottom>
        TULOKSET
      </Typography>
      <Table>
        <TableBody>
          {savedResults.map((player) => (
            <TableRow key={player.name}>
              <TableCell align="center">{player.name}</TableCell>
              <TableCell align="center">{`${player.points} pistettä`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {handleTearDown && (
        <div className={classes.marginTop}>
          <Fab variant="extended" color="secondary" onClick={handleTearDown}>
            Lopeta peli
          </Fab>
        </div>
      )}
      <Typography className={classes.marginTop}>
        Mikäli sinulle tuli pelin aikana kehitysideoita, ota yhteyttä;
        info@kotipelit.com.
      </Typography>
    </div>
  );
};

export default Results;
