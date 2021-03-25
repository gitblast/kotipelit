import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { RTCKotitonniPlayer } from '../../types';
import KotitonniPlayerPreview from './KotitonniPlayerPreview';
import wordService from '../../services/words';
import logger from '../../utils/logger';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      margin: theme.spacing(2),
      color: theme.palette.primary.light,
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
    [players, handlePlayerChange]
  );

  return (
    <div className={classes.container}>
      {players.map((player, index) => (
        <KotitonniPlayerPreview
          key={player.id}
          player={player}
          playerIndex={index}
          handleRefresh={handleRefresh}
        />
      ))}
    </div>
  );
};

export default PlayerUpdater;
