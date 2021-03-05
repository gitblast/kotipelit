const fs = require("fs");
const path = require("path");
const copy = require("recursive-copy");

const buildFolderPath = path.join(__dirname, "../client/build");

if (!fs.existsSync(buildFolderPath)) {
  throw new Error(`No build folder found at path '${buildFolderPath}'`);
}

const destinationPath = path.join(__dirname, "../server/build");

if (fs.existsSync(destinationPath)) {
  console.log("deleting existing backend build folder");

  fs.rmSync(destinationPath, { recursive: true });
}

copy(buildFolderPath, destinationPath)
  .then(() => console.log("succesfully copied new build folder to backend"))
  .catch((e) => {
    throw new Error(`Copying build folder failed: ${e.message}`);
  });
