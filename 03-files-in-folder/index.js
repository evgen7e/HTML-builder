const fs = require('fs');
const path = require('path');

const pathToFile = path.join(__dirname, 'secret-folder');

fs.readdir(pathToFile, {withFileTypes: true}, (errors, files) => {
  if (errors) {
    console.log(errors);
  }
  files.forEach(file => { 
    if (file.isFile()) {
      fs.stat(path.join(pathToFile, file.name), (errors, stat) => {
        if (errors) {
          console.log(errors);
        }

        let fileName = file.name.split('.'),
            fileSize = (stat.size / 1024).toFixed(3);

        console.log(`${fileName[0]} - .${fileName[1]} - ${(fileSize)} kb`);
      });
    }
  });
});