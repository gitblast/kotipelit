/**
 * Example usage: npx ts-node add_user username password emailaddress channelname
 */

import config from '../src/utils/config';
import bcrypt from 'bcryptjs';

import User from '../src/models/user';
import connection from '../src/utils/connection';
import { toNewUser } from '../src/utils/mappers';

const username = process.argv[2];
const password = process.argv[3];
const email = process.argv[4];
const channelName = process.argv[5];

if (!username) throw new Error('Anna käyttäjänimi ensimmäisenä parametrina!');
if (!password) throw new Error('Anna salasana toisena parametrina!');
if (!email) throw new Error('Anna email kolmantena parametrina!');
if (!channelName) throw new Error('Anna kanavan nimi neljäntenä parametrina!');

const addUser = async () => {
  try {
    await connection.connect(config.MONGODB_URI);

    const newUser = toNewUser({
      username,
      password,
      email,
      channelName,
    });

    console.log('\nTallennetaan käyttäjä:');

    console.log(`

  username: ${newUser.username}
  password: ${newUser.password}
  email: ${newUser.email}
  channel name: ${newUser.channelName}
  
  `);

    const passwordHash = await bcrypt.hash(newUser.password, 10);

    const user = new User({
      username: newUser.username,
      email: newUser.email,
      channelName: newUser.channelName,
      passwordHash,
      joinDate: new Date(),
    });

    await user.save();

    console.log('Käyttäjä tallennettu.');
  } catch (e) {
    console.log(`Tapahtui virhe: ${e.message}`);
  }

  await connection.close();
};

addUser();
