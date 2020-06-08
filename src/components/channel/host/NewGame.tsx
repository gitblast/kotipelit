import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import {
  Select,
  FormGroup,
  MenuItem,
  Typography,
  Paper,
  Divider,
  FormControl,
  TextField,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  IconButton,
  Fab,
} from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';

import { GameType, SanakiertoPlayer } from '../../../types';
import { useHistory, useParams } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(3),
    },
    formRow: {
      alignItems: 'center',
    },
    marginRight: {
      marginRight: theme.spacing(2),
    },
    gameInfo: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    buttonRow: {
      marginTop: theme.spacing(2),
    },
    wordCell: {
      minWidth: 190,
    },
  })
);

const hardcodedWords = [
  'DIABOLATRY',
  'FURIOUS',
  'ARCH',
  'DRUGSTORE',
  'DONATION',
  'HORROR',
  'SICK',
  'CARIBOU',
  'BLIP',
  'SNAIL',
  'AIRPORT',
  'MILKY',
  'THINGS',
  'PRAGMATIC',
  'NASTY',
  'CURVED',
  'LIBERATING',
  'BELT',
  'GRIZZLY',
  'BIGMOUTH',
  'HOROSCOPE',
  'LIME',
  'HIGHWAY',
  'THINGS',
  'MACHINE',
  'AGGRESSION',
  'BARBWIRE',
  'PROPELLER',
  'BLEEP',
  'DEDUCTION',
];

const getRandomWord = (): string => {
  return hardcodedWords[Math.floor(Math.random() * hardcodedWords.length)];
};

/**
 * Generates initial player objects to be used in state
 * @return {Array} - Array of 5 player objects with 3 unique, randow words each
 */
const initializePlayers = (): SanakiertoPlayer[] => {
  const players = [];
  const usedWords: string[] = [];

  for (let i = 1; i <= 5; i++) {
    const words: string[] = [];

    while (words.length < 3) {
      const randomWord = getRandomWord();
      if (!usedWords.includes(randomWord)) {
        words.push(randomWord);
        usedWords.push(randomWord);
      }
    }

    players.push({
      name: `Pelaaja ${i}`,
      words,
    });
  }

  return players;
};

// interface NewGameProps {}

const NewGame: React.FC = () => {
  const classes = useStyles();

  // game type
  const [selectedType, setSelectedType] = React.useState<GameType>(
    'sanakierto'
  );

  // player data
  const [players, setPlayers] = React.useState<SanakiertoPlayer[]>(
    initializePlayers()
  );

  // react router
  const { username } = useParams();
  const history = useHistory();

  const handleTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedType(event.target.value as GameType);
  };

  /**
   * Refreshes the word in the given index of the given player with a new, randow word
   * @param {SanakiertoPlayer} playerToUpdate - the player whose word will be updated
   * @param {number} wordIndex - the index of which word to refresh
   */
  const handleRefresh = (
    playerToUpdate: SanakiertoPlayer,
    wordIndex: number
  ): void => {
    setPlayers(
      players.map((player) => {
        if (player.name === playerToUpdate.name) {
          player.words[wordIndex] = getRandomWord();
        }

        return player;
      })
    );
  };

  const handleSubmit = () => console.log('todo');

  /**
   * Redirects back to host main page
   */
  const handleCancel = (): void => {
    history.push(username);
  };

  /**
   * Generates a table row for each player set in 'players' -state array
   */
  const playerRows = () =>
    players.map((player) => {
      return (
        <TableRow key={player.name}>
          <TableCell>
            <TextField label={player.name} />
          </TableCell>
          {player.words.map((word, index) => (
            <TableCell key={`${word}${index}`} className={classes.wordCell}>
              <span>{word} </span>
              <IconButton
                size="small"
                onClick={() => handleRefresh(player, index)}
              >
                <RefreshIcon />
              </IconButton>
            </TableCell>
          ))}
        </TableRow>
      );
    });

  return (
    <Paper elevation={5} className={classes.container}>
      <Typography variant="h4" gutterBottom>
        Luo uusi peli
      </Typography>
      <Divider />
      <FormGroup row className={classes.gameInfo}>
        <FormGroup row className={classes.formRow}>
          <Typography className={classes.marginRight} variant="h5">
            Ajankohta:
          </Typography>
          <TextField type="datetime-local" />
        </FormGroup>
        <FormGroup row className={classes.formRow}>
          <Typography className={classes.marginRight} variant="h5">
            Pelin tyyppi:
          </Typography>
          <FormControl variant="outlined">
            <Select
              defaultValue="sanakierto"
              value={selectedType}
              onChange={handleTypeChange}
              disabled
            >
              <MenuItem value="sanakierto">Sanakierto</MenuItem>
            </Select>
          </FormControl>
        </FormGroup>
      </FormGroup>
      <Typography variant="h5" gutterBottom>
        Pelaajat
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nimi</TableCell>
            <TableCell>Sana 1</TableCell>
            <TableCell>Sana 2</TableCell>
            <TableCell>Sana 3</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{playerRows()}</TableBody>
      </Table>
      <div className={classes.buttonRow}>
        <Fab
          variant="extended"
          color="primary"
          className={classes.marginRight}
          onClick={handleSubmit}
        >
          Luo peli
        </Fab>
        <Fab variant="extended" color="secondary" onClick={handleCancel}>
          Peruuta
        </Fab>
      </div>
    </Paper>
  );
};

export default NewGame;
