const fs = require('fs');
const path = require('path');

async function createDir(folder) {
  await fs.promises.rm(folder, {recursive: true, force: true});
  await fs.promises.mkdir(folder, {recursive: true});
}

async function copyDir(pathFrom, pathTo) {
  await fs.promises.rm(pathTo, {recursive: true, force: true});
  await fs.promises.mkdir(pathTo, {recursive: true});

  const files = await fs.promises.readdir(pathFrom, { withFileTypes: true });
  
  files.forEach(file => {
    const filePathFrom = path.resolve(pathFrom, file.name);
    const filepathTo = path.resolve(pathTo, file.name);
    if (file.isDirectory()) {
      copyDir(filePathFrom, filepathTo);
    } else {
      fs.promises.copyFile(filePathFrom, filepathTo);
    }
  });
}

async function createStyles(pathStyles) {
  const writeStream = fs.createWriteStream(path.resolve(__dirname, 'project-dist', 'style.css'));
  
  fs.readdir(pathStyles, {withFileTypes: true}, (errors, files) => {
    if (errors) {
      console.log(errors);
    }
    files.forEach((file) => {
      const filePath = path.resolve(pathStyles, file.name);
  
      if (file.isFile() && path.extname(filePath) === '.css') {
        let arr = [];
        let readStream = fs.createReadStream(filePath);
        readStream.on('data', chunk => arr.push(chunk));
        readStream.on('end', () => writeStream.write(arr.join('\n')));
      }
    });
  });
}

async function createHtml(pathComponents) {
  const readStream = fs.createReadStream(path.resolve(__dirname, 'template.html'), 'utf-8');

  let files = await fs.promises.readdir(pathComponents, {withFileTypes: true});

  let data = '';
  readStream.on('data', chunk => data += chunk);
  readStream.on('end', async () => {
    files.forEach(file => { 
      if (file.isFile()) {
        const readStreamFile = fs.createReadStream(path.resolve(__dirname, 'components', file.name), 'utf-8');
        const fileName = file.name.split('.')[0];
        let componentData = '';
        readStreamFile.on('data', chunk => componentData += chunk);
        readStreamFile.on('end', () => {
          data = data.replace(`{{${fileName}}}`, componentData);
          const writeStreamFile = fs.createWriteStream(path.resolve(__dirname, 'project-dist', 'index.html'));
          writeStreamFile.write(data);
        });
      }
    });
  });
}

async function buildProject() {
  await createDir(path.resolve(__dirname, 'project-dist'));
  await copyDir(path.resolve(__dirname, 'assets'), path.resolve(__dirname, 'project-dist', 'assets'));
  await createHtml(path.resolve(__dirname, 'components'));
  await createStyles(path.resolve(__dirname, 'styles'));
}

buildProject();
