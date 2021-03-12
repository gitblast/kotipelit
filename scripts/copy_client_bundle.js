import fs from "fs";
import copy from "recursive-copy";

const buildFolderPath = new URL("../client/build", import.meta.url).pathname;

if (!fs.existsSync(buildFolderPath)) {
  throw new Error(`No build folder found at path '${buildFolderPath}'`);
}

const destinationPath = new URL("../server/build", import.meta.url).pathname;

if (fs.existsSync(destinationPath)) {
  console.log("deleting existing backend build folder");

  fs.rmSync(destinationPath, { recursive: true });
}

copy(buildFolderPath, destinationPath)
  .then(() => console.log("succesfully copied new build folder to backend"))
  .catch((e) => {
    throw new Error(`Copying build folder failed: ${e.message}`);
  });
