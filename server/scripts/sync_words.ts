/** Example use: npx ts-node sync_words.js path/to/wordlist.txt */

import config from '../src/utils/config';

import fs from 'fs';
import Word from '../src/models/word';
import connection from '../src/utils/connection';

const filepath = process.argv[2];

if (!filepath) {
  throw new Error('Anna synkattavan tiedoston polku ensimmäisenä parametrina!');
}

const syncWords = async () => {
  try {
    let added = 0;

    await connection.connect(config.MONGODB_URI);

    const file = fs.readFileSync(filepath).toString();

    const words = file.split('\n');

    const wordsInDb = await Word.find({});

    const wordsInDbAsList = wordsInDb.map((w) => w.word);

    for (const word of words) {
      if (word && !wordsInDbAsList.includes(word)) {
        const wordToAdd = new Word({ word: word.trim() });

        await wordToAdd.save();

        added++;
      }
    }

    console.log(`\nLisättiin ${added} ${added !== 1 ? 'sanaa.' : 'sana.'}`);
  } catch (e) {
    throw new Error(`Tapahtui virhe: ${e.message}`);
  }

  await connection.close();
};

syncWords();
