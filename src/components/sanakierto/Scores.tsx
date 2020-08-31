import React from 'react';

import { SanakiertoPlayer } from '../../types';
import {
  TableRow,
  TableCell,
  Typography,
  TableBody,
  Table,
} from '@material-ui/core';

interface ScoresProps {
  players: SanakiertoPlayer[];
}

const Scores: React.FC<ScoresProps> = ({ players }) => {
  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>
            <Typography variant="overline">Pelaaja</Typography>
          </TableCell>
          <TableCell align="center">
            <Typography variant="overline">Pisteet</Typography>
          </TableCell>
        </TableRow>
        {players.map((player) => (
          <TableRow key={player.id}>
            <TableCell>{player.name}</TableCell>
            <TableCell align="center">{player.points}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Scores;
