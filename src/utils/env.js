const fs = require('fs');
const moment = require('moment');
const path = require('path');

const PROJECT_ROOT_PATH = path.join(__dirname, '../../');
const BUILD = path.join(PROJECT_ROOT_PATH, 'build');
const TEMP = path.join(PROJECT_ROOT_PATH, 'TEMP');
const BOOKMARKS = path.join(TEMP, 'bookmarks');

function readFromFile(file_name) {
    if (fs.existsSync(file_name)) {
        // readFile(file_name, (err, data) => {
        //     if (err) throw err;
        //     return data.toString();
        // });
        return fs
            .readFileSync(file_name, {
                encoding: 'utf-8',
                flag: 'r',
            })
            .toString();
    }
}

function writeToFile(file_name, content) {
    fs.writeFile(file_name, content, err => {
        if (err) {
            console.error(err);
            return;
        }
    });
}

function writeToRandomFile(content, callback) {
    let build = BUILD;
    if (fs.existsSync(build)) {
        // nothing to do
    } else {
        fs.mkdir(build, err => {
            if (err) throw err;
        });
    }
    let x_file = path.join(BUILD, moment().format('YYYYMMDD_HHmmss') + '.txt');
    if (x_file) {
        writeToFile(x_file, content);
        callback(x_file);
    }
}

module.exports = {
    PROJECT_ROOT_PATH,
    BUILD,
    TEMP,
    BOOKMARKS,
    readFromFile,
    writeToFile,
    writeToRandomFile,
};
