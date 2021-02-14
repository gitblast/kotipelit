require('dotenv').config();

const Word = require('../dist/models/word').default;
const connection = require('../dist/utils/connection').default;

const doIt = async () => {
  let changes = 0;

  try {
    await connection.connect(process.env.MONGODB_URI);

    const words = await Word.find({});

    const handled = [];

    for (const word of words) {
      const content = word.word;

      if (handled.includes(content)) {
        console.log('duplicate:', content);

        await Word.deleteOne({ word: content });

        changes++;
      } else {
        handled.push(content);
      }
    }
  } catch (e) {
    console.log('error', e.message);
  }

  console.log('changed', changes);

  await connection.close();
};

doIt();
