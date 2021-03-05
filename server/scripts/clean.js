const fs = require('fs');
const path = require('path');

const distFolderPath = path.join(__dirname, '../dist/');

if (fs.existsSync(distFolderPath)) {
  fs.rmSync(distFolderPath, { recursive: true });

  console.log('clean succesful');
} else {
  console.log('no dist folder found, continuing');
}
