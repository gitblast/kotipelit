const fs = require('fs');
const path = require('path');

const buildFolderPath = path.join(__dirname, '../build');

if (fs.existsSync(buildFolderPath)) {
  console.log('found client bundle (build folder)');
} else {
  throw new Error(
    'no build folder found, build client bundle and copy it to server root'
  );
}
