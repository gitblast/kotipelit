import Word from '../models/word';
import logger from '../utils/logger';

const getRandomWords = async (amount: number, excludedWords: string[] = []) => {
  const pipeline = [
    {
      $match: {
        word: {
          $nin: excludedWords,
        },
      },
    },
    {
      $sample: {
        size: amount,
      },
    },
  ];

  logger.log(
    `fetching ${amount} random words, excluding ${excludedWords.length} from search`
  );

  const wordModels = await Word.aggregate(pipeline);

  return wordModels.map((word) => word.word);
};

export default {
  getRandomWords,
};
