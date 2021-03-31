import { existsSync, rmSync } from 'fs';
import { join } from 'path';

const distFolderPath = join(__dirname, '../dist/');

if (existsSync(distFolderPath)) {
  rmSync(distFolderPath, { recursive: true });

  console.log('clean succesful');
} else {
  console.log('no dist folder found, continuing');
}
