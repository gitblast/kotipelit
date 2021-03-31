import path from 'path';
import config from '../src/utils/config';

import fs from 'fs';

import Word from '../src/models/word';
import connection from '../src/utils/connection';

const listWords = async () => {
  try {
    await connection.connect(config.MONGODB_URI);

    console.log('connected to db');
    console.log('fetching words...');
    console.log('');

    const wordsInDb = await Word.find({});

    const wordsInDbAsList = wordsInDb.map((w) => w.word);

    console.log(wordsInDbAsList.length, 'words found.');

    const fileName = `words-${new Date().getDate()}-${
      new Date().getMonth() + 1
    }.txt`;

    console.log('writing to', fileName, '...');
    console.log('');

    fs.writeFileSync(
      path.join(__dirname, fileName),
      wordsInDbAsList.join('\n')
    );

    console.log('done');
  } catch (e) {
    console.error('error listing words:', e.message);
  } finally {
    await connection.close();
  }
};

listWords();
