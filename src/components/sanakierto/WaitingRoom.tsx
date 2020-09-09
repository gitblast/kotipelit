import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  TableBody,
  Table,
  Fab,
  TableRow,
  TableCell,
  Typography,
} from '@material-ui/core';

import { KotitonniActive } from '../../types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    startBtn: {
      textAlign: 'center',
      margin: theme.spacing(2),
    },
  })
);

interface WaitingRoomProps {
  game: KotitonniActive;
  handleStart?: () => void;
}

const WaitingRoom: React.FC<WaitingRoomProps> = ({ game, handleStart }) => {
  const classes = useStyles();

  return (
    <div>
      {handleStart && (
        <div className={classes.startBtn}>
          <Fab variant="extended" onClick={handleStart}>
            Aloita peli
          </Fab>
        </div>
      )}
      <Table>
        <TableBody>
          {game.players.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.name}</TableCell>
              <TableCell>
                {p.online ? (
                  <Typography variant="caption" color="primary">
                    Paikalla
                  </Typography>
                ) : (
                  <Typography variant="caption" color="textSecondary">
                    Odotetaan...
                  </Typography>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default WaitingRoom;
