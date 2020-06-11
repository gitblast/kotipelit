import React from 'react';

import {
  FormGroup,
  MenuItem,
  Typography,
  FormControl,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  IconButton,
  Fab,
} from '@material-ui/core';

import { KeyboardDateTimePicker } from '@material-ui/pickers';

import RefreshIcon from '@material-ui/icons/Refresh';

import { Form, FastField, FieldArray, FormikProps } from 'formik';
import { TextField, Select } from 'formik-material-ui';

import { SanakiertoPlayer, SelectableGame } from '../../../types';

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
export const initializePlayers = (): SanakiertoPlayer[] => {
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
      points: 0,
    });
  }

  return players;
};

/**
 * Render function for form player table
 * @param players - Form state players
 * @param handleRefresh - Function to refresh a word to a new random word
 */
const renderTable = (
  players: SanakiertoPlayer[],
  handleRefresh: (player: SanakiertoPlayer, index: number) => void
) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Nimi</TableCell>
          <TableCell>Sana 1</TableCell>
          <TableCell>Sana 2</TableCell>
          <TableCell>Sana 3</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {players.map((player, index) => (
          <TableRow key={index}>
            <TableCell>
              <FastField component={TextField} name={`players.${index}.name`} />
            </TableCell>
            {player.words.map((word, index) => (
              <TableCell key={`${word}${index}`} style={{ minWidth: 190 }}>
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
        ))}
      </TableBody>
    </Table>
  );
};

/**
 * Render function for Formik component
 * @param props - Formik form props
 */
export const renderForm = (
  props: FormikProps<Omit<SelectableGame, 'id'>>,
  classes: Record<string, string>,
  handleReturn:
    | ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void)
    | undefined
) => {
  /**
   * Refreshes the word in the given index of the given player with a new, randow word
   * @param {SanakiertoPlayer} playerToUpdate - the player whose word will be updated
   * @param {number} wordIndex - the index of the word to refresh
   */
  const handleRefresh = (
    playerToUpdate: SanakiertoPlayer,
    wordIndex: number
  ): void => {
    const newPlayers = props.values.players.map((player) => {
      if (player.name === playerToUpdate.name) {
        const newWords = player.words;
        newWords[wordIndex] = getRandomWord();
        return { ...player, words: newWords };
      }

      return player;
    });

    props.setValues({
      ...props.values,
      players: newPlayers,
    });
  };

  return (
    <Form>
      <div className={classes.gameInfo}>
        <FormGroup row className={classes.formRow}>
          <Typography
            className={classes.marginRight}
            component="label"
            variant="h6"
            htmlFor="startTime"
          >
            Alkamisaika:
          </Typography>
          <FastField
            component={KeyboardDateTimePicker}
            autoOk
            ampm={false}
            format="d. MMMM HH:mm"
            disablePast
            name="startTime"
            value={props.values.startTime}
            onChange={(value: unknown) =>
              props.setFieldValue('startTime', value)
            }
          />
        </FormGroup>
        <FormGroup row className={classes.formRow}>
          <Typography
            className={classes.marginRight}
            component="label"
            variant="h6"
            htmlFor="type"
          >
            Pelin tyyppi:
          </Typography>
          <FormControl variant="outlined">
            <FastField component={Select} name="type" disabled>
              <MenuItem value="sanakierto">Sanakierto</MenuItem>
            </FastField>
          </FormControl>
        </FormGroup>
      </div>
      <div className={classes.gameInfo}>
        <Typography
          className={classes.marginRight}
          component="label"
          variant="h6"
          htmlFor="startTime"
        >
          Pelaajat:
        </Typography>
      </div>
      <FieldArray
        name="players"
        /**
         * arrayHelpers can be used to implement adding/removing fields,
         * see https://jaredpalmer.com/formik/docs/api/fieldarray#fieldarray-helpers
         */
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        render={(arrayHelpers) =>
          renderTable(props.values.players, handleRefresh)
        }
      />
      <div className={classes.buttonRow}>
        <Fab
          variant="extended"
          color="primary"
          className={classes.marginRight}
          type="submit"
        >
          Luo peli
        </Fab>
        <Fab variant="extended" color="secondary" onClick={handleReturn}>
          Peruuta
        </Fab>
      </div>
    </Form>
  );
};
