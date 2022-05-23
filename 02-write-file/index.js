const fs = require('fs');
const path = require('path');
const { stdin, stdout } = require('process');

const output = fs.createWriteStream(path.resolve(__dirname, 'text.txt'));

stdout.write('Добрый день! Введите текст для записи в файл:\n');

process.on('exit', () => {
    stdout.write('До новых встреч!');
});

stdin.on('data', function(data) {
    if (data.indexOf('exit') !== -1)  {
        process.exit();
    } else {
        output.write(data);
    }
});

process.on('SIGINT', function() {
    process.exit();
});
