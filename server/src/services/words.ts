import Word from '../models/word';
import { WordModel } from '../types';

const getRandomWords = async (amount: number) => {
  const wordModels = await Word.aggregate<WordModel>().sample(amount);

  return wordModels.map((word) => word.word);
};

export default {
  getRandomWords,
};
