import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { RTCKotitonniPlayer } from '../../types';
import { Paper } from '@material-ui/core';
import KotitonniPlayerPreview from './KotitonniPlayerPreview';
import wordService from '../../services/words';
import logger from '../../utils/logger';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(2),
      maxWidth: 1000,
    },
  })
);

interface PlayerUpdaterProps {
  handlePlayerChange: React.Dispatch<
    React.SetStateAction<RTCKotitonniPlayer[] | null>
  >;
  players: RTCKotitonniPlayer[];
}

const PlayerUpdater: React.FC<PlayerUpdaterProps> = ({
  players,
  handlePlayerChange,
}) => {
  const classes = useStyles();

  const handleRefresh = React.useCallback(
    async (playerToUpdateId: string, wordIndex: number): Promise<void> => {
      try {
        const randomWord = await wordService.getOne();

        const newPlayers = players.map((player) => {
          const newWords = [...player.privateData.words];

          if (player.id === playerToUpdateId) {
            newWords[wordIndex] = randomWord;

            return {
              ...player,
              privateData: {
                ...player.privateData,
                words: newWords,
              },
            };
          }

          return player;
        });

        handlePlayerChange(newPlayers);
      } catch (e) {
        logger.error(`error fetching word: ${e.message}`);
      }
    },
    [players]
  );

  return (
    <Paper className={classes.container}>
      {players.map((player, index) => (
        <KotitonniPlayerPreview
          key={player.id}
          player={player}
          playerIndex={index}
          handleRefresh={handleRefresh}
        />
      ))}
    </Paper>
  );
};

export default PlayerUpdater;
