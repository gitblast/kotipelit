import { existsSync } from 'fs';
import { join } from 'path';

const buildFolderPath = join(__dirname, '../build');

if (existsSync(buildFolderPath)) {
  console.log('found client bundle (build folder)');
} else {
  throw new Error(
    'no build folder found, build client bundle and copy it to server root'
  );
}
