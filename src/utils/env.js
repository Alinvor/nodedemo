const fs = require('fs');
const path = require('path');

const PROJECT_ROOT_PATH = path.join(__dirname, '../../');
const BUILD = path.join(PROJECT_ROOT_PATH, 'build');
const TEMP = path.join(PROJECT_ROOT_PATH, 'TEMP');

function writeToFile(file_name, content) {
    fs.writeFile(file_name, content, err => {
        if (err) {
            console.error(err);
            return;
        }
    });
}

module.exports = {
    PROJECT_ROOT_PATH,
    BUILD,
    TEMP,
    writeToFile,
};
