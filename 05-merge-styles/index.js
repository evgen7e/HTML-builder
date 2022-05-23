const fs = require('fs');
const path = require('path');

const pathToFile = path.resolve(__dirname, 'project-dist', 'bundle.css');
const writeStream = fs.createWriteStream(path.resolve(pathToFile));
const pathToStyles = path.resolve(__dirname, 'styles');

fs.readdir(pathToStyles, {withFileTypes: true}, (errors, files) => {
  if (errors) {
    console.log(errors);
  }
  files.forEach((file) => {
    const filePath = path.resolve(pathToStyles, file.name);

    if (file.isFile() && path.extname(filePath) === '.css') {
      let arr = [];
      let readStream = fs.createReadStream(filePath);
      readStream.on('data', chunk => arr.push(chunk));
      readStream.on('end', () => writeStream.write(arr.join('\n')));
    }
  });
});