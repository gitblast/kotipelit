import config from '../src/utils/config';

import Word from '../src/models/word';
import connection from '../src/utils/connection';

const doIt = async () => {
  let changes = 0;

  try {
    await connection.connect(config.MONGODB_URI);

    const words = await Word.find({});

    const handled: string[] = [];

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
