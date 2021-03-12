const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const fs = require('fs');

const Word = require('../dist/models/word').default;
const connection = require('../dist/utils/connection').default;

const listWords = async () => {
  try {
    connection.connect(process.env.MONGODB_URI);

    console.log('connected to db');
    console.log('fetching words...');
    console.log('');

    const wordsInDb = await Word.find({});

    const wordsInDbAsList = wordsInDb.map((w) => w.word);

    console.log(wordsInDbAsList.length, 'words found.');

    const date = new Date();

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
