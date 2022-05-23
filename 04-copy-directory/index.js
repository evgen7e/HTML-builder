const fs = require('fs');
const path = require('path');

async function copyDir(pathFrom, pathTo) {
  await fs.promises.rm(pathTo, {recursive: true, force: true});
  await fs.promises.mkdir(pathTo, {recursive: true});

  const files = await fs.promises.readdir(pathFrom);
  
  files.forEach(file => {
    const filePathFrom = path.resolve(pathFrom, file);
    const filepathTo = path.resolve(pathTo, file);
    fs.promises.copyFile(filePathFrom, filepathTo);
  });
}

copyDir(path.resolve(__dirname, 'files'), path.resolve(__dirname, 'files-copy'));
