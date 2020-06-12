import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { SanakiertoPlayer } from '../../../../types';
import {
  Typography,
  Table,
  TableRow,
  TableCell,
  TableBody,
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(2),
    },
    header: {
      marginLeft: theme.spacing(2),
    },
  })
);

interface ResultsProps {
  results: SanakiertoPlayer[];
}

const Results: React.FC<ResultsProps> = ({ results }) => {
  const classes = useStyles();
  let placement = 1;

  return (
    <div className={classes.container}>
      <Typography variant="h4" gutterBottom className={classes.header}>
        PELI PÄÄTTYI
      </Typography>
      <Table>
        <TableBody>
          {results.map((player, index) => {
            const row = (
              <TableRow key={player.name}>
                <TableCell>{/** placement here? */ player.name}</TableCell>
                <TableCell>{`${player.points} pistettä`}</TableCell>
              </TableRow>
            );

            /** handle shared placements */
            if (
              index < results.length - 1 &&
              results[index + 1].points < player.points
            ) {
              placement += 1;
            }

            return row;
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default Results;
