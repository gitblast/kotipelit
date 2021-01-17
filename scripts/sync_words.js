/** Example use: node sync_words.js path/to/wordlist.txt */

require('dotenv').config();

const fs = require('fs');

const Word = require('../dist/models/word').default;
const connection = require('../dist/utils/connection').default;

const filepath = process.argv[2];

if (!filepath) {
  throw new Error('Anna synkattavan tiedoston polku ensimmäisenä parametrina!');
}

const syncWords = async () => {
  try {
    let added = 0;

    connection.connect(process.env.MONGODB_URI);

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
